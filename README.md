# Mapeamento-Comercial
![version](https://img.shields.io/badge/version-1.0-blue)

Develop and monitor the sales strategy of the commercial team through an application for collective use.

This project is an app builded on AppSheet and has the main objective of mapping the classes of students and new client by a simple way.

This project was developed to a company who works with graduations party in brazil. 
This repository is a empty sample of the app.

# Live Demo

## [LIVE VERSION - Mapeamento Comercial Sample](https://www.appsheet.com/templates/Sistema-de-Intelig%C3%AAncia-Comercial-para-Empresas-de-Formaturas?appGuidString=a9436ec2-a586-494d-8352-bf38b8efe3af)

# Instalation Guide: 

- Create a new Stand alone script in Google Apps Script
- Import 'Scripts/script.gs' into the new stand alone script.
- Replace the 'DB_ID' to your database sheet id.
- Check the [Mapeamento Comercial Sample](https://www.appsheet.com/templates/Sistema-de-Intelig%C3%AAncia-Comercial-para-Empresas-de-Formaturas?appGuidString=a9436ec2-a586-494d-8352-bf38b8efe3af) App and make a copy of it. 
- In AppSheet, configure the "Script.gs" as script source in *automations* functions
- Remeber to edit your share settings, branding info and all other configurations.
- Deploy your app. Enjoy it. 

### Final adjustiments...

Setting your Images Routes
For 'Empresas'
- Upload the folders "Empresas_Images" to your Goggle Drive Root Folder.
- In AppSheet, Data/Tabuleiros/Columns/ search for 'Empresa Logo', edit it, and set the path to the image in your Google Drive Root Folder as default directory.

For 'Representantes'
- Upload the folders "Representantes_Images" to your Goggle Drive Root Folder.
- In AppSheet, Data/Representantes/ click 'View Source', go to the sheet 'Representates' and set the path to image in column 'avatar'.

For 'Instituições'
- Upload the folders "Instituições_Images" to your Goggle Drive Root Folder.
- In AppSheet, Data/Instituições/ click 'View Source', go to the sheet 'Instituições' and set the path to image in column 'logo'.

### Remember

Update the list of emails on automations tasks to recive notifications as well.




