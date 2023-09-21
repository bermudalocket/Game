// import { env } from "$env/dynamic/private"
// import { Client } from "ts-postgres"
//
// const postgres = new Client({
// 	host: "localhost",
// 	port: 5432,
// 	database: "postgres",
// 	user: "postgres",
// 	password: env.POSTGRES_PASSWORD,
// })
//
// postgres.on("connect", () => {})
// postgres.on("error", (err) => {
// 	console.error(err)
// })
//
// postgres.prepare("SELECT 1;").then((stmt) => {
// 	stmt.execute().then((res) => {
// 		console.log(res)
// 	})
// })
//
// if (env.NODE_ENV === "development") {
// 	postgres.connect().then(() => {
// 		console.log("Connected to Postgres")
// 	})
// } else {
// 	postgres.connect().then(() => {
// 		console.log("Connected to Postgres")
// 	})
//
// }