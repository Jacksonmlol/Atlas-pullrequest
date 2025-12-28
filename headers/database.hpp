#include <pqxx/pqxx>
#include "cenv.hpp"

class Database {
public:
    Database(const std::string& conn_str);
    pqxx::connection& getConnection();

private:
    pqxx::connection conn;  // <-- plain object, not a reference
};

inline Database connect_db() {
    std::string dbname = clang_env::find_token("database", "dbname");
    std::string user = clang_env::find_token("database", "user");
    std::string password = clang_env::find_token("database", "password");
    std::string host = clang_env::find_token("database", "host");

    std::string conn_str = "dbname=" + dbname + " user=" + user + " password=" + password + " host=" + host;
    Database db(conn_str);

    return db;
}