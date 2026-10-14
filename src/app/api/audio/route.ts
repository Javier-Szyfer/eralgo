import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { type NextRequest, NextResponse } from "next/server";
import { trackKeyMap } from "@/data/albums";

function env(name: string): string {
	const value = process.env[name];
	if (!value) throw new Error(`Missing environment variable ${name}`);
	return value;
}

let s3: S3Client | undefined;

function getS3Client(): S3Client {
	s3 ??= new S3Client({
		region: "auto",
		endpoint: `https://${env("R2_ACCOUNT_ID")}.r2.cloudflarestorage.com`,
		credentials: {
			accessKeyId: env("R2_ACCESS_KEY_ID"),
			secretAccessKey: env("R2_SECRET_ACCESS_KEY"),
		},
	});
	return s3;
}

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
		Bucket: env("R2_BUCKET_NAME"),
		Key: objectKey,
	});

	const url = await getSignedUrl(getS3Client(), command, { expiresIn: 300 });

	return NextResponse.json({ url });
}
