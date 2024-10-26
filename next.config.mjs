import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
	reactStrictMode: true,
	redirects: async () => {
		return [
			{
				source: "/",
				destination: "/docs/installation",
				permanent: true,
			},
		];
	},
};

const isEnvDev = process.env.NODE_ENV === "development";
isEnvDev && process.argv.push("dev")

export default withMDX(config);
