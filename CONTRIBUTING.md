# Contributing

Thanks for your interest in contributing to hook.again! Please take a moment to review this document before submitting a pull request.

## Introduction

hook.again is a collection of reusable React hooks that can be installed using the shadcn CLI.

## Development

To develop hook.again locally:

1. Fork this repository
2. Clone your fork
3. Create a new branch
4. Run `pnpm install` to install dependencies
5. Run `pnpm dev` to start the development server

## Project structure

- `/app` - Next.js app
- `/components` - React components used in the docs
- `/content` - MDX documentation
- `/hooks` - React hooks
- `/lib` - Utility functions
- `/public` - Static assets
- `/registry` - Hook registry and schemas
- `/scripts` - Build and utility scripts

## Adding a new hook

1. Create a new hook file in `/registry/hooks/use-[name].ts`
2. Add hook documentation in `/content/docs/(hooks)/use-[name].mdx`
3. Add the hook to `/registry/registry-hooks.ts`
4. Run `pnpm build:registry` to update the registry

### Hook guidelines

- Keep hooks focused and single-purpose
- Include TypeScript types
- Follow React hooks best practices
- Include error handling where appropriate
- Keep dependencies minimal

### Documentation guidelines

- Include a clear description
- Provide installation instructions using the `<ComponentInstall />` component
- Show practical usage examples

## Pull Request Guidelines

1. Create a new branch from `main`
2. Keep changes focused and atomic
3. Add tests if applicable
4. Update documentation as needed
5. Run `pnpm lint` to check for code style issues
6. Ensure all tests pass
7. Submit a pull request

## Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm build:registry` - Update hook registry
- `pnpm lint` - Check code style
- `pnpm start` - Start production server

## Need help?

- Open a [discussion](https://github.com/ilyichv/hook.again/discussions) for questions
- Open an [issue](https://github.com/ilyichv/hook.again/issues) for bugs
- Submit a [pull request](https://github.com/ilyichv/hook.again/pulls) with improvements

## License

By contributing to hook.again, you agree that your contributions will be licensed under its MIT license.
