/*
 * @Author: mmmmmmmm
 * @Date: 2022-07-14 09:16:39
 * @Description: TCP服务端
 */
const net = require("net");
const PackageBuffer = require("./packageBuffer");
const server = net.createServer();
const PROT = 8890;
const HOST_NAME = "localhost";
/**@name 客户端标识前缀 */
const CLIENT_PREFIX = "client_"
let clientIndex = 0
const myPackageBuffer = new PackageBuffer();
server.on("listening", () => {
    console.log(`TCP服务端已开启 ${HOST_NAME}:${PROT}`)
}).on("connection", (socket) => {
    const businessName = CLIENT_PREFIX + (clientIndex++)
    console.log(`新客户端 ：${businessName} 进入 `)
    let overBuffer = null;
    socket.on("data", (chunk) => {
        // 1 检查有没有溢出的没有使用的数据
        if (overBuffer) {
            // 1.1 有则于新数据合并（由于TCP保证了数据的顺序,所以大数据不会出现断层或者数据交错的问题）
            chunk = Buffer.concat([overBuffer, chunk])
        }
        // 2 声明一个当前数据长度
        let currentDataLength = 0
        // 2.1 获取数据长度
        while (currentDataLength = myPackageBuffer.getDataLength(chunk)) {
            // 2.2 如果获取数据长度大于实际数据长度，则表示数据已超出TCP单次传输最大值（这时TCP会采用分包机制）
            if (chunk.length < currentDataLength) {
                //2.3 由于超出TCP会采用分包则将数据暂时缓存等待下一次数据进入在判断处理
                overBuffer = chunk;
                break;
            } else {
                //3 解包获取正常数据，长度，索引
                console.log("新数据的字节长度", myPackageBuffer.decode(chunk).dataLength);
                //3.1 裁剪出未处理的数据用于下一次循环处理
                chunk = chunk.slice(currentDataLength + myPackageBuffer.headLength);
            }
        }
    })
    socket.on("close", () => {
        console.log(`${businessName} 已离开`)
    })
    socket.on("error", (err) => {
        console.log("客户端错误", err)
    })
}).on("error", (err) => {
    console.log(err);
})
server.listen(PROT, HOST_NAME);