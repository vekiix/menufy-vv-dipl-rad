package com.menufy.auth_service.service;

import com.menufy.auth_service.exceptions.InvalidCredentialsException;
import lombok.RequiredArgsConstructor;
import org.bouncycastle.crypto.engines.AESEngine;
import org.springframework.stereotype.Service;
import org.bouncycastle.crypto.BlockCipher;
import org.bouncycastle.crypto.Mac;
import org.bouncycastle.crypto.macs.CMac;
import org.bouncycastle.crypto.params.KeyParameter;

import javax.xml.bind.DatatypeConverter;
import java.util.Arrays;

@Service
@RequiredArgsConstructor
public class CryptographyService {

    public byte[] calculateCMACValueForPICCData(String uid, String counter, String encryptionKey){
        byte[] kSdm = hexStringToByteArray(encryptionKey);

        StringBuilder skvHex = new StringBuilder("3CC300010080" + uid + counter.replaceFirst("^0+", ""));
        while (skvHex.length() < 32) {
            skvHex.append("0");
        }
        try {
            byte[] skv = hexStringToByteArray(skvHex.toString());
            byte[] kSes = calculateMFCMAC(kSdm, skv, false);

            return calculateMFCMAC(kSes, new byte[0], true);
        } catch (Exception e){
            throw new RuntimeException(e.getMessage());
        }
    }

    public boolean validateCMACForNFCScan(String uid, String counter, String cmac, String encryptionKey) {
            return Arrays.equals(calculateCMACValueForPICCData(uid,counter,encryptionKey), hexStringToByteArray(cmac));
    }

    public String generateCMACDataForSpecificScan(String uid, int counter, String encryptionKey){
            return byteArrayToHexString(this.calculateCMACValueForPICCData(uid, intToSixCharHexString(counter), encryptionKey));
    }


    public byte[] calculateMFCMAC(byte[] key, byte[] valueToMAC, boolean shorten) throws Exception{
            int cmacSize = 16;
            BlockCipher cipher = AESEngine.newInstance();
            Mac cmac = new CMac(cipher, cmacSize * 8);
            KeyParameter keyParameter = new KeyParameter(key);
            cmac.init(keyParameter);
            cmac.update(valueToMAC, 0, valueToMAC.length);
            byte[] CMAC = new byte[cmacSize];
            cmac.doFinal(CMAC, 0);

            byte[] MFCMAC = new byte[cmacSize / 2];

            if(shorten){
                int j = 0;
                for (int i = 0; i < CMAC.length; i++) {

                    if (i % 2 != 0) {
                        MFCMAC[j] = CMAC[i];
                        j += 1;
                    }
                }
                return MFCMAC;

            }
            return CMAC;
    }


    private byte[] hexStringToByteArray(String hex) {
        return DatatypeConverter.parseHexBinary(hex);
    }

    private String byteArrayToHexString(byte[] byteArray) {
        if (byteArray == null || byteArray.length == 0) {
            throw new IllegalArgumentException("Byte array cannot be null or empty");
        }
        return DatatypeConverter.printHexBinary(byteArray).toUpperCase();
    }

    public int hexToInteger(String hex) {
        if (hex == null || hex.isEmpty()) {
            throw new IllegalArgumentException("Hex string cannot be null or empty");
        }

        try {
            return Integer.parseInt(hex, 16);
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Invalid hex number: " + hex, e);
        }
    }
    public String intToSixCharHexString(int number) {
        if (number < 0 || number > 0xFFFFFF) {
            throw new IllegalArgumentException("Number out of range. Must be between 0 and 16777215 (0xFFFFFF).");
        }
        return String.format("%06X", number);
    }



}
