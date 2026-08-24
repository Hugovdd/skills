# Automic Vault for project secrets

Hugo uses **Automic Vault (`av`)** for new coding-project secrets. Keep secret values out of source files, shell history, command arguments, and committed `.env` files.

## Normal workflow

- Save project-only values from the project directory: `av save --project-directory=. SECRET_NAME`.
- Apply a value only when needed: `av inject +SECRET_NAME -- command`.
- Prefer `av proxy` or a supported `av harden` flow when it fits the tool.
- Keep non-secret configuration in `.env`; never write an Automic Vault session reference there.

## Agent rules

- Do not ask users to paste secret values into chat.
- Do not print, log, or test a secret by revealing it.
- Do not create new project credentials in 1Password. Treat it as a legacy migration source only.
- Do not bulk-read or automatically delete 1Password items. Inventory names only, migrate through `av harden` or the user's hidden `av save` prompt, verify the protected consumer, then rotate the old credential at its provider.
- Use the narrowest supported route: tool hardener, proxy, blessed script, then direct injection.
- Ask immediately before creating a credential or materially expanding persistent access.
