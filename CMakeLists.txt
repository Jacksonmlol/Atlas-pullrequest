cmake_minimum_required(VERSION 3.16)
project(AtlasScarlet)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Find required packages
find_package(Threads REQUIRED)
find_package(OpenSSL REQUIRED)
find_package(PostgreSQL REQUIRED)
find_package(PkgConfig REQUIRED)
pkg_check_modules(PQXX REQUIRED libpqxx)

# Add executable
add_executable(atlas_server main.cpp database.cpp messaging.cpp server.cpp invites.cpp)

# Include directories
target_include_directories(atlas_server PRIVATE 
    ${PROJECT_SOURCE_DIR}/libs/jwt-cpp/include
    ${OPENSSL_INCLUDE_DIR}
    ${PQXX_INCLUDE_DIRS}
)

# Link libraries
target_link_libraries(atlas_server
    PRIVATE
    ${PQXX_LIBRARIES}
    pq
    PostgreSQL::PostgreSQL
    Threads::Threads
    OpenSSL::SSL
    OpenSSL::Crypto
    argon2
)

target_compile_options(atlas_server PRIVATE -Wno-unknown-attributes)