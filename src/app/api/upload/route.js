import { NextResponse } from 'next/server'
import { Storage } from '@google-cloud/storage'

const storage = new Storage({
    projectId: process.env.GOOGLE_PROJECT_ID,
    credentials: {
        type: 'service_account',
        project_id: process.env.GOOGLE_PROJECT_ID,
        private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
        private_key: process.env.GOOGLE_PRIVATE_KEY,
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        universe_domain: 'googleapis.com',
    },
})

const bucketName = process.env.GOOGLE_BUCKET_NAME

export async function POST(req) {
    try {
        const { fileName, fileType, path } = await req.json()
        const filePath = `${path}/${fileName}`
        const bucket = storage.bucket(bucketName)
        const file = bucket.file(filePath)

        const [url] = await file.getSignedUrl({
            action: 'write',
            expires: Date.now() + 15 * 60 * 1000, // 15 minutes
            contentType: fileType,
        })

        return NextResponse.json({ url, filePath })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to generate presigned URL' }, { status: 500 })
    }
}
