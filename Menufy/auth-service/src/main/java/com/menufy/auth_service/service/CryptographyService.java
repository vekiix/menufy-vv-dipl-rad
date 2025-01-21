package com.menufy.auth_service.service;

import com.menufy.auth_service.exceptions.InvalidCredentialsException;
import lombok.RequiredArgsConstructor;
import org.bouncycastle.crypto.engines.AESEngine;
import org.bouncycastle.util.encoders.Hex;
import org.springframework.stereotype.Service;
import org.bouncycastle.crypto.BlockCipher;
import org.bouncycastle.crypto.Mac;
import org.bouncycastle.crypto.engines.AESFastEngine;
import org.bouncycastle.crypto.macs.CMac;
import org.bouncycastle.crypto.params.KeyParameter;

import javax.xml.bind.DatatypeConverter;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.Arrays;
import java.util.HexFormat;

@Service
@RequiredArgsConstructor
public class CryptographyService {

    public boolean validateCMACForNFCScan(String uid, String counter, String cmac, String encryptionKey) {

        byte[] kSdm = hexStringToByteArray(encryptionKey);

        StringBuilder skvHex = new StringBuilder("3CC300010080" + uid + counter.replaceFirst("^0+", ""));
        while (skvHex.length() < 32) {
            skvHex.append("0");
        }
        try {
            byte[] skv = hexStringToByteArray(skvHex.toString());
            byte[] kSes = calculateMFCMAC(kSdm, skv, false);
            byte[] calculatedCmac = calculateMFCMAC(kSes, new byte[0], true);

            System.out.println(Arrays.toString(skv));
            System.out.println(Arrays.toString(calculatedCmac));
            System.out.println(Arrays.toString(hexStringToByteArray(cmac)));
            return Arrays.equals(calculatedCmac, hexStringToByteArray(cmac));
        } catch (Exception e) {
            throw new InvalidCredentialsException();
        }
    }


    public byte[] calculateMFCMAC(byte[] key, byte[] valueToMAC, boolean shorten) throws Exception{
            int cmacSize = 16;
            BlockCipher cipher = new AESFastEngine();
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

}
