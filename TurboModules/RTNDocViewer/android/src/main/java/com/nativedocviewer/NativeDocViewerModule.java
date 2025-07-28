package com.nativedocviewer;

import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.net.Uri;
import android.os.AsyncTask;
import android.util.Log;
import android.webkit.MimeTypeMap;
import android.content.Context;
import androidx.annotation.NonNull;
import androidx.core.content.FileProvider;

import android.webkit.CookieManager;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.module.annotations.ReactModule;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLDecoder;
import java.util.Objects;

public class NativeDocViewerModule extends NativeDocViewerSpec {
    public static final int ERROR_NO_HANDLER_FOR_DATA_TYPE = 53;
    public static final int ERROR_FILE_NOT_FOUND = 2;
    public static final int ERROR_UNKNOWN_ERROR = 1;
    private final ReactApplicationContext reactContext;
    public static final String NAME = "RNDocViewer";

    public NativeDocViewerModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @NonNull
    @Override
    public String getName() {
        return NAME;
    }
    public  String getFileNameFromUrl(String url) {
        if (url == null || url.isEmpty()) return null;

        Uri uri = Uri.parse(url);
        String path = uri.getPath();      // 获取路径部分
        if (path != null) {
            // 提取最后一个"/"后的部分作为文件名
            int lastSegmentIndex = path.lastIndexOf('/');
            if (lastSegmentIndex != -1 && lastSegmentIndex + 1 < path.length()) {
                return path.substring(lastSegmentIndex + 1);
            }
        }
        return "";
    }
    public  String getFileExtension(String url) {
        try {
            String filename = Uri.parse(url).getLastPathSegment();
            if (filename == null) return null;
            String decodedName = URLDecoder.decode(filename, "UTF-8");
            int pos = decodedName.lastIndexOf('.');
            return (pos > 0) ? decodedName.substring(pos + 1) : null;
        } catch (Exception e) {
            return "";
        }
    }
    @Override
    public void openDoc(ReadableArray fileParams, Callback callback) {
        Log.d("测试", "openDoc");
        final ReadableMap arg_object = fileParams.getMap(0);
        try {
            if (arg_object.getString("url") != null) {
                // parameter parsing
                final String url = arg_object.getString("url");
                final String fileName =this.getFileNameFromUrl(url);
                final String fileType =this.getFileExtension(url);
                final Boolean cache =arg_object.getBoolean("cache");
                final byte[] bytesData = new byte[0];
                // Begin the Download Task
                new FileDownloaderAsyncTask(callback, url, cache, fileName, fileType, bytesData).execute();
            }else{
                callback.invoke(false);
            }
        } catch (Exception e) {
            callback.invoke(e.getMessage());
        }
    }

    @Override
    public void openDocBinaryinUrl(ReadableArray fileParams, Callback callback) {

    }

    @Override
    public void openDocb64(ReadableArray fileParams, Callback callback) {

    }
    private class FileDownloaderAsyncTask extends AsyncTask<Void, Void, File> {
        private final Callback callback;
        private final String url;
        private final String fileName;
        private final Boolean cache;
        private final String fileType;
        private final byte[] bytesData;

        public FileDownloaderAsyncTask(Callback callback,
                                       String url, Boolean cache, String fileName, String fileType, byte[] bytesData) {
            super();
            this.callback = callback;
            this.url = url;
            this.fileName = fileName;
            this.cache = cache;
            this.fileType = fileType;
            this.bytesData = bytesData;
        }

        @Override
        protected File doInBackground(Void... arg0) {
            if (url.startsWith("content://")) {
                File file = null;
                try {
                    InputStream in = Objects.requireNonNull(getCurrentActivity()).getContentResolver().openInputStream(Uri.parse(url));
                    file = copyFile(in, fileName, cache, fileType, bytesData, callback);
                } catch (FileNotFoundException e) {
                    System.out.println(e);
                }
                return  file;
            } else if (!url.startsWith("file://")) {
                System.out.println("Url to download" + url);
                return downloadFile(url, fileName, cache, fileType, bytesData, callback);
            } else {
                return new File(url.replace("file://", ""));
            }
        }

        @Override
        protected void onPostExecute(File result) {
            if (result == null) {
                // Has already been handled
                return;
            }

            Context context = getCurrentActivity();
            String mimeType;
            // mime type of file data
            if (fileType != null) {
                // If file type is already specified, should just take the mimeType from it
                mimeType = MimeTypeMap.getSingleton().getMimeTypeFromExtension(fileType);
            } else {
                mimeType = getMimeType(url);
            }
            if (mimeType == null || context == null) {
                return;
            }
            try {

                Uri contentUri = FileProvider.getUriForFile(context, reactContext.getPackageName()+".docViewer_provider", result);
                System.out.println("ContentUri");
                System.out.println(contentUri);

                Intent intent = new Intent(Intent.ACTION_VIEW);
                intent.setDataAndType(contentUri, mimeType);
                intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                intent.setFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);

                if (intent.resolveActivity(context.getPackageManager()) != null) {
                    context.startActivity(intent);
                    // Thread-safe.
                    callback.invoke(null, fileName);
                } else {
                    activityNotFoundMessage("Activity not found to handle: " + contentUri.toString() + " (" + mimeType + ")");
                }
            } catch (ActivityNotFoundException e) {
                activityNotFoundMessage(e.getMessage());
            }

        }

        private void activityNotFoundMessage(String message) {
            System.out.println("ERROR");
            System.out.println(message);
            callback.invoke(message);
            //e.printStackTrace();
        }
    }
    // used for all downloaded files, so we can find and delete them again.
    private final static String FILE_TYPE_PREFIX = "PP_";
    /**
     * downloads the file from the given url to external storage.
     *
     * @param url
     * @return
     */
    private File downloadFile(String url, String fileName, Boolean cache, String fileType, byte[] bytesData, Callback callback) {

        try {
            Context context = getReactApplicationContext().getBaseContext();
            File outputDir = context.getCacheDir();
            if(bytesData.length > 0){
                // use cache
                File f = cache != null && cache ? new File(outputDir, fileName) : File.createTempFile(FILE_TYPE_PREFIX, "." + fileType,
                        outputDir);
                System.out.println("Bytes will be creating a file");
                final FileOutputStream fileOutputStream;
                try {
                    fileOutputStream = new FileOutputStream(f);
                } catch (FileNotFoundException e) {
                    e.printStackTrace();
                    return null;
                }

                final BufferedOutputStream bufferedOutputStream = new BufferedOutputStream(
                        fileOutputStream);
                try {
                    bufferedOutputStream.write(bytesData);
                } catch (IOException e) {
                    e.printStackTrace();
                    return null;
                } finally {
                    try {
                        bufferedOutputStream.close();
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }
                return f;
            }else{
                String extension = MimeTypeMap.getFileExtensionFromUrl(url);
                System.out.println("Extensions DownloadFile " + extension);
                if (extension.equals("") && fileType.equals("")) {
                    extension = "pdf";
                    System.out.println("extension (default): " + extension);
                }

                if (fileType != "" && extension.equals("")) {
                    extension = fileType;
                    System.out.println("extension (default): " + extension);
                }

                // check has extension
                if (fileName.indexOf("\\.") == -1){
                    fileName = fileName + '.' + extension;
                }
                // if use cache, check exist
                if (cache != null && cache) {
                    File existFile = new File(outputDir, fileName);
                    if (existFile.exists()){
                        return existFile;
                    }
                }

                // get an instance of a cookie manager since it has access to our
                // auth cookie
                CookieManager cookieManager = CookieManager.getInstance();

                // get the cookie string for the site.
                String auth = null;
                if (cookieManager.getCookie(url) != null) {
                    auth = cookieManager.getCookie(url).toString();
                }

                URL url2 = new URL(url);
                HttpURLConnection conn = (HttpURLConnection) url2.openConnection();
                File f;
                try {
                    if (auth != null) {
                        conn.setRequestProperty("Cookie", auth);
                    }
                    InputStream reader = conn.getInputStream();

                    // use cache
                    f = cache != null && cache ? new File(outputDir, fileName)
                            : File.createTempFile(FILE_TYPE_PREFIX, "." + extension, outputDir);

                    // make sure the receiving app can read this file
                    f.setReadable(true, false);
                    System.out.println(f.getPath());
                    FileOutputStream outStream = new FileOutputStream(f);

                    //GET Connection Content length
                    int fileLength = conn.getContentLength();
                    /*int readBytes = reader.read(buffer);
                    while (readBytes > 0) {
                        outStream.write(buffer, 0, readBytes);
                        readBytes = reader.read(buffer);
                    }*/
                    byte[] buffer = new byte[4096];
                    long total = 0;
                    int readBytes = reader.read(buffer);
                    while (readBytes > 0) {
                        total += readBytes;
                        // publishing the progress....
                        if (fileLength > 0) // only if total length is known
                            System.out.println((int) (total * 100 / fileLength));
                        outStream.write(buffer, 0, readBytes);
                        readBytes = reader.read(buffer);
                    }
                    reader.close();
                    outStream.close();
                    if (f.exists()) {
                        System.out.println("File exists");
                    } else {
                        System.out.println("File doesn't exist");
                    }

                    return f;
                } catch (Exception err) {
                    err.printStackTrace();
                } finally {
                    conn.disconnect();
                }

                return null;
            }




        } catch (FileNotFoundException e) {
            e.printStackTrace();
            callback.invoke(ERROR_FILE_NOT_FOUND);
            return null;
        } catch (IOException e) {
            e.printStackTrace();
            callback.invoke(ERROR_UNKNOWN_ERROR);
            return null;
        }
    }
    private File copyFile(InputStream in, String fileName, Boolean cache, String fileType, byte[] bytesData, Callback callback) {

        try {
            Context context = getReactApplicationContext().getBaseContext();
            File outputDir = context.getCacheDir();
            if (bytesData.length > 0) {
                // use cache
                File f = cache != null && cache ? new File(outputDir, fileName) : File.createTempFile(FILE_TYPE_PREFIX, "." + fileType,
                        outputDir);
                System.out.println("Bytes will be creating a file");
                final FileOutputStream fileOutputStream;
                try {
                    fileOutputStream = new FileOutputStream(f);
                } catch (FileNotFoundException e) {
                    e.printStackTrace();
                    return null;
                }

                final BufferedOutputStream bufferedOutputStream = new BufferedOutputStream(
                        fileOutputStream);
                try {
                    bufferedOutputStream.write(bytesData);
                } catch (IOException e) {
                    e.printStackTrace();
                    return null;
                } finally {
                    try {
                        bufferedOutputStream.close();
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }
                return f;
            } else {
                String extension = MimeTypeMap.getFileExtensionFromUrl(fileName);
                System.out.println("Extensions DownloadFile " + extension);
                if (extension.isEmpty() && fileType.isEmpty()) {
                    extension = "pdf";
                    System.out.println("extension (default): " + extension);
                }

                if (!Objects.equals(fileType, "") && extension.isEmpty()) {
                    extension = fileType;
                    System.out.println("extension (default): " + extension);
                }

                // check has extension
                if (!fileName.contains("\\.")) {
                    fileName = fileName + '.' + extension;
                }
                // if use cache, check exist
                if (cache != null && cache) {
                    File existFile = new File(outputDir, fileName);
                    if (existFile.exists()) {
                        return existFile;
                    }
                }


                File f;
                try {
                    // use cache
                    f = cache != null && cache ? new File(outputDir, fileName)
                            : File.createTempFile(FILE_TYPE_PREFIX, "." + extension, outputDir);

                    // make sure the receiving app can read this file
                    f.setReadable(true, false);
                    System.out.println(f.getPath());

                    try {
                        FileOutputStream outStream = new FileOutputStream(f);
                        try {
                            // Transfer bytes from in to out
                            byte[] buf = new byte[1024];
                            int len;
                            while ((len = in.read(buf)) > 0) {
                                outStream.write(buf, 0, len);
                            }
                        } finally {
                            outStream.close();
                        }
                    } finally {
                        in.close();
                    }

                    if (f.exists()) {
                        System.out.println("File exists");
                    } else {
                        System.out.println("File doesn't exist");
                    }

                    return f;
                } catch (Exception err) {
                    err.printStackTrace();
                }

                return null;
            }


        } catch (FileNotFoundException e) {
            e.printStackTrace();
            callback.invoke(ERROR_FILE_NOT_FOUND);
            return null;
        } catch (IOException e) {
            e.printStackTrace();
            callback.invoke(ERROR_UNKNOWN_ERROR);
            return null;
        }
    }
    /**
     * Returns the MIME Type of the file by looking at file name extension in
     * the URL.
     *
     * @param url
     * @return
     */
    private static String getMimeType(String url) {
        String mimeType = null;
        System.out.println("Url: " + url);
        url = url.replaceAll(" ", "");
        String extension = MimeTypeMap.getFileExtensionFromUrl(url);
        if (extension != null) {
            mimeType = MimeTypeMap.getSingleton().getMimeTypeFromExtension(extension);
        }

        if (mimeType == null) {
            mimeType = "application/pdf";
            System.out.println("Mime Type (default): " + mimeType);
        }

        return mimeType;
    }
}
