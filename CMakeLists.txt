cmake_minimum_required(VERSION 3.10)
cmake_policy(SET CMP0072 NEW)
project(learn-opengl)

find_package(glfw3 REQUIRED)
find_package(OpenGL REQUIRED)
find_package(glm CONFIG REQUIRED)

add_library(GLAD "lib/glad.c")

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_FLAGS_DEBUG "-g")
set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

# ===============source files=================
file(GLOB_RECURSE ALL_SOURCE_FILES src/*.cpp src/*.h)

# ===============source dirs==================
file(GLOB_RECURSE ALL_ITEMS LIST_DIRECTORIES true "src/*")

set(SUBDIRECTORIES "")

foreach(ITEM ${ALL_ITEMS})
    if(IS_DIRECTORY "${ITEM}")
        list(APPEND SUBDIRECTORIES "${ITEM}")
    endif()
endforeach()


add_executable(LearnOpenGL ${ALL_SOURCE_FILES})
target_link_libraries(LearnOpenGL
    PUBLIC
        glfw
        OpenGL::GL
        GLAD
    PRIVATE
        glm::glm-header-only
)

target_include_directories(LearnOpenGL 
    PUBLIC 
        ${SUBDIRECTORIES}
)

file(COPY res DESTINATION ${CMAKE_CURRENT_BINARY_DIR})

include_directories(${CMAKE_SOURCE_DIR}/include)
