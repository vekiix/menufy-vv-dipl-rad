export interface CompanyParametersRes {
    company: CompanyParameters
}

export interface CompanyParameters {
    id: string;
    name: string;
    oib: string;
    keksPayParameters: KeksPayParameters
    wsPayParameters: WsPayParameters
}

export interface KeksPayParameters {
    qr_type: number
    cid: string
    tid: string
    valid: boolean
}

export interface KeksPayParametersReq {
    qr_type: number
    cid: string
    tid: string
}

export interface WsPayParametersReq {
    shopId: string
    version: string
}

export interface WsPayParameters {
    shopID: string
    version: string
    valid: boolean
}