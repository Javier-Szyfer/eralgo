import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextRequest, NextResponse } from "next/server";
import { trackKeyMap } from "@/data/albums";

const s3 = new S3Client({
	region: "auto",
	endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
	credentials: {
		accessKeyId: process.env.R2_ACCESS_KEY_ID!,
		secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
	},
});

export async function GET(request: NextRequest) {
	const trackId = request.nextUrl.searchParams.get("trackId");

	if (!trackId) {
		return NextResponse.json({ error: "Missing trackId" }, { status: 400 });
	}

	const objectKey = trackKeyMap[trackId];
	if (!objectKey) {
		return NextResponse.json({ error: "Unknown track" }, { status: 404 });
	}

	const command = new GetObjectCommand({
		Bucket: process.env.R2_BUCKET_NAME!,
		Key: objectKey,
	});

	const url = await getSignedUrl(s3, command, { expiresIn: 300 });

	return NextResponse.json({ url });
}
