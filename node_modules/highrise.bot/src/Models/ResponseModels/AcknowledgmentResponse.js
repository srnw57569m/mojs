const BaseResponse = require("../../Base/BaseResponse")

class AcknowledgmentResponse extends BaseResponse {
    build() {
        this.ok = true
    }
}

module.exports = AcknowledgmentResponse