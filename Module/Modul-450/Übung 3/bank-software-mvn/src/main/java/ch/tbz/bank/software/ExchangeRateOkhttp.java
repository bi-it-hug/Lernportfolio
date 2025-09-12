package ch.tbz.bank.software;

import com.google.gson.Gson;

import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;

public class ExchangeRateOkhttp {

    // https://apilayer.com/marketplace/exchangerates_data-api?live_demo=show?e=Sign+In&l=Success

    // certificate problem:
    // https://stackoverflow.com/questions/21076179/pkix-path-building-failed-and-unable-to-find-valid-certification-path-to-requ
    // keytool -import -alias Cert -keystore  "C:\Program Files\Java\jdk-17.0.2\lib\security\cacerts" -file "C:\Users\truebt\Downloads\ZScaler Root CA.crt"

    /**
     * Gets exchange rate from web service
     * @param currencyFrom
     * @param currencyTo
     * @return
     */
    public double getExchangeRate(String currencyFrom, String currencyTo) {
        OkHttpClient client = new OkHttpClient().newBuilder().build();

        Request request = new Request.Builder()
                .url("https://api.apilayer.com/exchangerates_data/convert?to="+currencyTo+"&from="+currencyFrom+"&amount=1")
                .addHeader("apikey", "aZA8SRPPWKe8RCu4fLT9dGtgAUfkwVfS")
                .method("GET", null)
                .build();

        try{
            Response response = client.newCall(request).execute();

            Gson gson = new Gson();
            Rate r = gson.fromJson(response.body().string(), Rate.class);
            return r.result;
        } catch (Exception e) {
            System.out.println("! Error bei der Abfrage des Wechselkurses: " + e.getMessage());
            return 0.0;
        }
    }

    public class Rate {
        public double result;
    }

    /* response example
    {
        "success": true,
        "query": {
            "from": "EUR",
            "to": "CHF",
            "amount": 1
        },
        "info": {
            "timestamp": 1666945204,
            "rate": 0.98929
        },
        "date": "2022-10-28",
        "result": 0.98929
    }
     */
}
