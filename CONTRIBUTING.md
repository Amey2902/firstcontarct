# Contributing to BLACKBOX AI

Thank you for your interest in contributing to **BLACKBOX AI** on the Midnight Network!

## Development Guidelines

1. **Compact Contracts**: All zero-knowledge circuits and ledger state definitions are located in `contracts/`. Ensure any added circuits maintain strict zero-knowledge invariants (never leak raw witnesses into public ledger state).
2. **Automated Tests**: Write Jest/TypeScript tests in `tests/` covering all new circuit branches, edge cases, and failure modes.
3. **Frontend**: The frontend is built with React 18, Vite, and TailwindCSS. Keep components modular and ensure support for both **Lace Wallet** and **1AM Wallet**.
4. **Commits**: Follow [Conventional Commits](https://www.conventionalcommits.org/) format (`feat:`, `fix:`, `docs:`, `test:`, `refactor:`, `chore:`).

## Running Tests

```bash
npm install
npm test
```

## Pull Request Process

1. Fork the repository and create a feature branch (`git checkout -b feat/my-feature`).
2. Verify all unit tests pass (`npm test`) and frontend builds cleanly (`cd frontend && npm run build`).
3. Commit your changes with descriptive commit messages.
4. Submit a Pull Request targeting `main`.
