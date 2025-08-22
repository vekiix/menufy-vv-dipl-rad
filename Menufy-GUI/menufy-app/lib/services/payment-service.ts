import { Payment } from "../models/Payment";
import { CompanyParameters, CompanyParametersRes, KeksPayParametersReq, WsPayParametersReq } from "../res/CompanyParameters";
import { PaymentResponse } from "../res/PaymentResponse";
import axiosInstance from "./axios";



export const validateKeksPayParameters = async (): Promise<CompanyParameters> => {
    const response = await axiosInstance.get<CompanyParametersRes>(`/payment/parameters/validate`, {    
    params: {
        paymentType: "KEKS_PAY"
    }})
    return response.data.company;
}

export const validateWSPayParameters = async (): Promise<CompanyParameters> => {
    const response = await axiosInstance.get<CompanyParametersRes>(`/payment/parameters/validate`, {    
    params: {
        paymentType: "WS_PAY"
    }})
    return response.data.company;
}

export const getPaymentParameters = async (): Promise<CompanyParameters> => {
    const response = await axiosInstance.get<CompanyParametersRes>(`/payment/parameters`)
    return response.data.company;
}

export const saveKeksPayParameters = async (params: KeksPayParametersReq): Promise<CompanyParameters> => {
    const response = await axiosInstance.post<CompanyParametersRes>(`/payment/parameters/kpay`, params)
    return response.data.company;
}

export const saveWSPayParameters = async (params: WsPayParametersReq): Promise<CompanyParameters> => {
    const response = await axiosInstance.post<CompanyParametersRes>(`/payment/parameters/wspay`, params)
    return response.data.company;
}


export const getPaymentInfo = async (transactionToken:string): Promise<Payment> => {
    const response = await axiosInstance.get<PaymentResponse>(`/payment/${transactionToken}`)
    return response.data.payment;
}


export const initiateCreditCardPayment = async (paymentId: string, cardData: {
    firstName: string,
    lastName: string,
    cardNumber: string,
    cvv: string
}): Promise<Payment> => {
    const response = await axiosInstance.post<PaymentResponse>(
        `/payment/${paymentId}?paymentType=WS_PAY`,
        cardData 
    );
    return response.data.payment;
}

export const initiateKeksPayPayment = async (paymentId: string, phoneNumber: string): Promise<Payment> => {
    const response = await axiosInstance.post<PaymentResponse>(
        `/payment/${paymentId}?paymentType=KEKS_PAY`,
        { phoneNumber }
    );
    return response.data.payment;
}