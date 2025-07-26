cmake_minimum_required(VERSION 3.4.1)
set(CMAKE_VERBOSE_MAKEFILE on)

set(rnoh_docviewer_generated_dir "${CMAKE_CURRENT_SOURCE_DIR}/generated")
file(GLOB_RECURSE rnoh_docviewer_generated_SRC "${rnoh_docviewer_generated_dir}/**/*.cpp")
file(GLOB rnoh_docviewer_SRC CONFIGURE_DEPENDS *.cpp)
add_library(rnoh_docviewer SHARED ${rnoh_docviewer_SRC} ${rnoh_docviewer_generated_SRC})
target_include_directories(rnoh_docviewer PUBLIC ${CMAKE_CURRENT_SOURCE_DIR} ${rnoh_docviewer_generated_dir})
target_link_libraries(rnoh_docviewer PUBLIC rnoh)