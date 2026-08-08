# onboarding-web
SPA for onboarding peoples

Onboarding, tilbakestilling av passord, og verifisering av brukere ved bruk av ID-porten. Dette er frontend, bruker BFF for autentisering / autorisering. [Se BFF / onboarding-api her](https://github.com/vestfoldfylke/onboarding-api)

## Flyter
### Tilbakestill passord
- Velger aktiver bruker/tilbakestill passord
- Script spør onboarding-api om å få loginurl til idporten, med action "resetpassword" som query param - redirecter så til id-porten-loginUrl den får av onboard-api
- Bruker logger på idporten og blir redirected tilbake til /idportencallback
- /idportencallback sjekker at den har fått med seg state, code, og iss i query params, så sjekker den om action (i state) er "resetpassword", og sender bruker over til /resetpassord sammen med state, code, og iss
- /resetpassord sender så mottat state, code, iss videre til onboarding-api/ResetPassword - api logger inn brukern, resetter passordet, sender sms ++
- Bruker klikker så på "Klikk her når du har fått SMS" når hen har fått SMS  - script spør så api om å gå loginurl til password-appreg (EntraID), og redirecter til denne
- Bruker logger på entraID (password appreg) - blir sendt tilbake til /entrapwdcallback
- /entrapwdcallback tar i mot state og code, sender over til onboarding-api, logger inn bruker, returnerer upn og logEntryId
- /entrapwdcallback script ber deretter om loginurl til mfa-appreg (EntraID), og redirecter til denne
- Bruker logger på entraID (mfa appreg) - blir sendt tilbake til /entramfacallback
- /entramfacallback tar i mot state og code, sender over til /success
- /success sender over state og code til onboarding-api, api logger inn brukeren (igjen), returner upn, logEntryId, displayName. Nå er den ferdig

### Passordfri innlogging (passkey via TAP)
- Velger «sett opp passordfri innlogging» på /elev eller /ansatt
- Script spør onboarding-api om å få loginurl til idporten, med action "passkey" som query param - redirecter så til id-porten-loginUrl den får av onboard-api
- Bruker logger på idporten og blir redirected tilbake til /idportencallback
- /idportencallback sjekker at den har fått med seg state, code, og iss i query params, så sjekker den om action (i state) er "passkey", og sender bruker over til /passkey sammen med state, code, og iss
- /passkey sender så mottatt state, code, iss videre til onboarding-api/StartPasskeyOnboarding - api logger inn brukeren, henter Entra-brukeren og utsteder en engangs Temporary Access Pass (TAP) via Graph, returnerer temporaryAccessPass, lifeTimeInMinutes, expireDateTime, logEntryId, upn og displayName
- Frontenden viser TAP-koden på skjerm med kopi-knapp og lenke til `https://aka.ms/mysecurityinfo` (åpnes i ny fane). TAP-verdien lagres ikke i database og persisteres ikke i klienten (kun i minne så lenge komponenten lever).
- Bruker registrerer passkey på Microsoft-siden ved hjelp av engangskoden, og trykker deretter «Jeg er ferdig»
- /passkey sender så logEntryId til onboarding-api/CompletePasskeyOnboarding - api sjekker via Graph om en passkey/FIDO2-metode faktisk er registrert
- Ved `completed: true` navigerer frontend til /passkey/success. Ved `completed: false` vises melding fra API og «Prøv igjen»-knapp uten å navigere bort - bruker kan fullføre registreringen og prøve på nytt.

### Aktiver / verifiser bruker
- Velger aktiver/verifiser bruker
- Script spør onboarding-api om å få loginurl til idporten, med action "verifyuser" som query param - redirecter så til id-porten-loginUrl den får av onboard-api
- Bruker logger på idporten og blir redirected tilbake til /idportencallback
- /idporten callback sjekker at den har fått med seg state, code, og iss i query params, så sjekker den om action (i state) er "verifyuser", og sender bruker over til /verifyuser sammen med state, code, og iss
- /verifyuser sender så mottat state, code, iss videre til onboarding-api/VerifyUser - api logger inn brukern (idporten), returner logEntryId, upn, displayName
- /verifyuser script ber deretter om loginurl til mfa-appreg (EntraID), og redirecter til denne
- Bruker logger på entraID (mfa appreg) - blir sendt tilbake til /entramfacallback
- /entramfacallback tar i mot state og code, sender over til /success
- /success sender over state og code til onboarding-api, api logger inn brukeren (igjen), returner upn, logEntryId, displayName. Nå er den ferdig

## Routes
### /
Startside, gir deg valget om du er elev eller ansatt

### /elev
Elevside, gir deg to valg - tilbakestill passord, og sett opp passordfri innlogging (passkey).
- Tilbakestill passord spør api om loginUrl til ID-Porten (params: user_type=elev&action=resetpassword) og redirecter deg dit
- Passkey spør api om loginUrl til ID-Porten (params: user_type=elev&action=passkey) og redirecter deg dit

### /ansatt
Ansattside, gir deg valg om å tilbakestille passord, eller sette opp passordfri innlogging (passkey).
- Tilbakestill passord spør api loginUrl til ID-Porten (params: user_type=ansatt&action=resetpassword) og redirecter deg dit
- Passkey spør api loginUrl til ID-Porten (params: user_type=ansatt&action=passkey) og redirecter deg dit

### /idportencallback
Callbackside for ID-porten redirects. Tar i mot state, code, iss - henter userType og action fra state, og sender videre førhåldsvis til /resetpassord, /verifyuser eller /passkey (jøss, her har jeg brukt norsk og engelsk om hverandre...)

### /resetpassord
Får state, code, og iss fra page-state. Sender over til api, og venter på respons. Bruker kan klikke seg videre når hen har fått midlertidig passord på SMS. Da hentes loginUrl for entraPwd enterprise-app, viser ei litta dialog med info om neste steg, og redirecter til loginUrl etter noen sekunder.

### /verifyuser
Får state, code, og iss fra page-state. Sender over til api, og venter på respons. Ved 200 respons, henter loginUrl for entraMfa-enterprise-app, og redirecter.

### /passkey
Får state, code, og iss fra page-state. Sender over til api/StartPasskeyOnboarding, og venter på respons. Viser TAP-koden på skjerm med kopi-knapp og lenke til `https://aka.ms/mysecurityinfo`. Når bruker trykker «Jeg er ferdig» kalles api/CompletePasskeyOnboarding med logEntryId. Ved `completed: true` navigerer til /passkey/success, ellers vises retry-melding.

### /passkey/success
Får displayName og userPrincipalName fra page-state. Bekrefter at passkey er registrert.

### /entrapwdcallback
Callbackside for entraPwd-enterprise-app redirects. Tar i mot state og code, og sender til api /EntraPwdAuth, om 200 respons, henter loginUrl for entraMfa-enterprise-app og redirecter til respons
Om VITE_STUDENT_PC_AGREEMENT_REQUIRED=true og brukeren kommer seg hit, og er en elev, så har de også akseptert ELEV-PC vilkår. For å finne hvem som har gjort det, søk opp i database:

Bytt ut `YYYY-MM-DD` med datoen du satte VITE_STUDENT_PC_AGREEMENT_REQUIRED=true, eller fra tidspunktet du vil sjekke at det er gjort

```js
{
  userType: "elev",
  "passwordChanged.successful": true,
  "startedTimestamp": { $gt: "YYYY-MM-DD" }
}
```

### /entramfacallback
Callbackside for entraMfa-enterprise-app redirects. Tar i mot state og code, sjekker state om den inneholder en action, og sender videre førhåldsvis til /success eller /stats

### /success
Får state og code fra page-state. Sender over til api, og venter på respons. Om 200 respons er alt good, og kidden viser tommel opp 👍

### /admin
Litt småskjult - gir deg valg om å logge på for å se statistikk 

### /stats
Får state og code fra page-state. Sender over til api, og venter på respons. Om 200 respons følger det med statistikk, og UX-designer har laget masse fine grafer.

## Env variables
```bash
VITE_ONBOARDING_API_URI="http://localhost:7071/api" # Trengs ikke om mock-api er true
VITE_ONBOARDING_API_PUBLIC_KEY="skikkeligbrakeysomerpublicallikevelsåikkesåfarlig" # Trengs ikke om mock-api er true
VITE_MOCK_API="true/false" # Om "true", så mockes alle api-kall 
VITE_SERVICEDESK_TLF="33 44 55 66"
VITE_SERVICEDESK_EPOST="servicedesk@fisfylke.no"
VITE_UTENLANDSREISE_SKJEMA_URL="https://<url-til-ureis-skjema>.no" # Hvis du vil få opp knapp med lenke til skjema for utenlandsreise
```

## Mock-api
Sett VITE_MOCK_API til "true", da mockes alle api-kall lokalt i browser. Sjekk ./src/lib/useApi.js for å se mocke-data (må være samme format som API returnerer da)

## Utvikling
- Klon ned, eller fork, og klon ned
- `npm i`
- `npm run dev`
- Herje i vei
