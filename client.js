/*
 * @Author: mmmmmmmm
 * @Date: 2022-07-14 09:16:47
 * @Description: TCP客户端
 */
const net = require("net");
const PackageBuffer = require("./packageBuffer");

const PROT = 8890;
const HOST_NAME = "localhost";
const client = net.createConnection({
    host: HOST_NAME,
    port: PROT
});
const myPackageBuffer = new PackageBuffer();
let str = "";
for (let index = 0; index < 1000000; index++) {
    str += 1;

}
client.on("connect", () => {
    console.log("连接成功")
    // 多次发送会出现粘包现象，需要使用封包来处理
    const buf = Buffer.from(str);
    console.log("字节长度", buf.length);
    client.write(myPackageBuffer.encode(buf));
    client.write(myPackageBuffer.encode(buf));
    client.write(myPackageBuffer.encode(buf));
    client.write(myPackageBuffer.encode(buf));
    client.write(myPackageBuffer.encode(buf));

})
client.on("error", (err) => {
    console.log("连接错误", err)
})
client.on("close", () => {
    console.log("连接已断开")
})