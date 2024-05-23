# onboarding-web
SPA for onboarding peoples
test

# Flyt
## Tilbakestill passord
- Velger aktiver bruker/tilbakestill passord
- Script spør onboarding-api om å få loginurl til idporten, med action "resetpassword" som query param - redirecter så til id-porten-loginUrl den får av onboard-api
- Bruker logger på idporten og blir redirected tilbake til /idportencallback
- /idporten callback sjekker at den har fått med seg state, code, og iss i query params, så sjekker den om action (i state) er "resetpassword", og sender bruker over til /resetpassord sammen med state, code, og iss
- /resetpassord sender så mottat state, code, iss videre til onboarding-api/ResetPassword - api logger inn brukern, resetter passordet, sender sms ++
- Bruker klikker så på "Klikk her når du har fått SMS" når hen har fått SMS  - script spør så api om å gå loginurl til password-appreg (EntraID), og redirecter til denne
- Bruker logger på entraID (password appreg) - blir sendt tilbake til /entrapwdcallback
- /entrapwdcallback tar i mot state og code, sender over til onboarding-api, logger inn bruker, returnerer upn og logEntryId
- /entrapwdcallback script ber deretter om loginurl til mfa-appreg (EntraID), og redirecter til denne
- Bruker logger på entraID (mfa appreg) - blir sendt tilbake til /entramfacallback
- /entramfacallback tar i mot state og code, sender over til /success
- /success sender over state og code til onboarding-api, api logger inn brukeren (igjen), returner upn, logEntryId, displayName. Nå er den ferdig

## Aktiver / verifiser bruker
- Velger aktiver/verifiser bruker
- Script spør onboarding-api om å få loginurl til idporten, med action "verifyuser" som query param - redirecter så til id-porten-loginUrl den får av onboard-api
- Bruker logger på idporten og blir redirected tilbake til /idportencallback
- /idporten callback sjekker at den har fått med seg state, code, og iss i query params, så sjekker den om action (i state) er "verifyuser", og sender bruker over til /verifyuser sammen med state, code, og iss
- /verifyuser sender så mottat state, code, iss videre til onboarding-api/VerifyUser - api logger inn brukern (idporten), returner logEntryId, upn, displayName
- /verifyuser script ber deretter om loginurl til mfa-appreg (EntraID), og redirecter til denne
- Bruker logger på entraID (mfa appreg) - blir sendt tilbake til /entramfacallback
- /entramfacallback tar i mot state og code, sender over til /success
- /success sender over state og code til onboarding-api, api logger inn brukeren (igjen), returner upn, logEntryId, displayName. Nå er den ferdig