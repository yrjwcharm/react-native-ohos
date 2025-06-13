cmake_minimum_required(VERSION 3.4.1)
set(CMAKE_VERBOSE_MAKEFILE on)

set(rnoh_svgaplayer_generated_dir "${CMAKE_CURRENT_SOURCE_DIR}/generated")
file(GLOB_RECURSE rnoh_svgaplayer_generated_SRC "${rnoh_svgaplayer_generated_dir}/**/*.cpp")
file(GLOB rnoh_svgaplayer_SRC CONFIGURE_DEPENDS *.cpp)
add_library(rnoh_svgaplayer SHARED ${rnoh_svgaplayer_SRC} ${rnoh_svgaplayer_generated_SRC})
target_include_directories(rnoh_svgaplayer PUBLIC ${CMAKE_CURRENT_SOURCE_DIR} ${rnoh_svgaplayer_generated_dir})
target_link_libraries(rnoh_svgaplayer PUBLIC rnoh)