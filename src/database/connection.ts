// import mssql from "mssql";
// import config from "../config";

// export const dbSettings = {
//   user: config.dbUser,
//   password: config.dbPassword,
//   server: config.dbServer,
//   database: config.dbDatabase,
//   options: {
//    -> encrypt: true, // for azure
//    -> trustServerCertificate: true, // change to true for local dev / self-signed certs
//   },
// };

// export const getConnection = async () => {
//   try {
//     console.log('📡 Before Pool Connection 🔌');
//     const pool = await mssql.connect(dbSettings);
//     return pool;
//   } catch (error) {
//     console.error('🩸 DB Conn ERROR: 🩸' ,error);
//     return null;
//   }
// };

// export { mssql };
