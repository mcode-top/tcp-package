/*
 * @Author: mmmmmmmm
 * @Date: 2022-07-14 09:38:42
 * @Description: 封包解包
 */

class PackageBuffer {
    constructor() {
        /**@name 定义头部长度 */
        this.headLength = 8;
        /**@name  0-4表示包索引，4-8表示数据长度 */
        this.dataOffset = 4;
        this.index = 0;
    }
    /**
     * @name 编码
     * @param {Buffer} data
     * @returns {Buffer}
     */
    encode(data) {
        if (!Buffer.isBuffer(data)) {
            data = Buffer.from(data);
        }
        const dataLength = data.length;
        const headBuffer = Buffer.alloc(this.headLength);
        headBuffer.writeInt32BE(this.index++);
        headBuffer.writeInt32BE(dataLength, this.dataOffset);
        return Buffer.concat([headBuffer, data], this.headLength + dataLength)
    }
    /**
     * @name 解码 
     * @param {Buffer} data
     * */
    decode(data) {
        const headBuffer = data.slice(0, this.headLength);
        const dataLength = this.getDataLength(data);
        
        const rdata = data.slice(this.headLength, dataLength + this.headLength)
        return {
            index: headBuffer.slice(0, 4).readInt32BE(),
            dataLength,
            data: rdata.toString()
        }
    }
    /**
     * @name 获取数据长度 
     * @param {Buffer} data
     * */
    getDataLength(data) {
        if (data.length < this.headLength) {
            return 0;
        }
        return data.slice(this.dataOffset, this.dataOffset + 4).readInt32BE();
    }
}

module.exports = PackageBuffer;