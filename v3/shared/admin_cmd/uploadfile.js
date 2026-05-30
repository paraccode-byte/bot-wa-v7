import { Octokit } from "octokit";
import crypto from 'crypto';
import 'dotenv/config';

const octokit = new Octokit({
    auth: process.env.GITHUB_ACCESS_TOKEN
});
export default async function upload_file(buffer) {
    try {
        const owner = 'paraccode-byte';
        const repo = 'banner';
        const path = crypto.randomUUID() + '.jpg';
        const contentEncoded = Buffer.from(buffer).toString('base64');
        const response = await octokit.request(`PUT /repos/${owner}/${repo}/contents/${path}`, {
            owner: owner,
            repo: repo,
            path: path,
            message: `add file: ${path}`,
            content: contentEncoded,
        });
        return response.data.content;
    } catch (err) {
        console.error("Detail Error GitHub:", err.response?.data || err.message);
        throw err;
    }
}