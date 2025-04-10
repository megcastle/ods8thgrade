'use server'

import { google } from 'googleapis';

export async function saveData(data, uuid, babyPictureURL, recentPictureURL) {

    const auth = await google.auth.getClient({
        projectId: process.env.GOOGLE_PROJECT_ID,
        credentials: {
            "type": "service_account",
            "project_id": process.env.GOOGLE_PROJECT_ID,
            "private_key_id": process.env.GOOGLE_PRIVATE_KEY_ID,
            "private_key": process.env.GOOGLE_PRIVATE_KEY,
            "client_email": process.env.GOOGLE_CLIENT_EMAIL,
            "universe_domain": "googleapis.com"
        },
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth});
    const ssId = process.env.GOOGLE_SPREADSHEET_ID;

    let dataArray = [
        uuid,
        data.firstName,
        data.lastName,
        data.team,
        babyPictureURL,
        recentPictureURL,
        data.message,
        data.parentName,
        data.parentEmail,
        data.content,
        data.consent,
    ];

    try {
        await sheets.spreadsheets.values.append({
            auth: auth,
            spreadsheetId: ssId,
            range: 'Sheet1!A:K',
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [
                    dataArray
                ]
            }
        }, {});

        return { success: true };
    } catch (error) {
        throw new Error("Failed to save data to Google Sheets");
    }
}

