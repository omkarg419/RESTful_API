import http from "node:http"
import { createApplication } from "./app/index.js"

async function main(){
  try {
    const server =http.createServer(createApplication())
    const PORT: number=8000

    server.listen(PORT,()=>{
      console.log(`HTTP server is running on Port ${PORT}`);
    })
  } catch (error) {
    console.error("Error starting HTTP server:", error);
  }
}
main()