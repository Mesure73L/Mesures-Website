# Contribution Courtesies

Thanks for your interest in helping out with this repository! Before you contribute to this repository, please read these guidelines in detail.

## Bug Busting

If you found a bug, follow these instructions:

**Is there a security vulnerability?**

- Yes
  - Do not publicly report the issue. Instead, refer to our [Security Policy](https://github.com/Mesure73L/mesure.x10.mx/blob/main/.github/SECURITY.md).
- No
  - Answer the following questions.

**Do you know a patch?**

- Yes
  - Create a [bug report](https://github.com/Mesure73L/mesure.x10.mx/issues/new?assignees=&labels=bug&projects=&template=1-bug-report.yml) issue mentioning the issue, and say that you can patch it. Create a fork of the repository, make the patch, and create a pull request.
- No
  - Create a [bug report](https://github.com/Mesure73L/mesure.x10.mx/issues/new?assignees=&labels=bug&projects=&template=1-bug-report.yml) issue describing it with detail.

## Coding Conventions

Our main goal is readability for all users.

- We indent with 4 spaces.
- We put spaces around list items (`[1, 2, 3]`) and around operators (`x += 1`).
- We do not obfuscate anything in any way.
- We make sure everyone is able to read our code without pausing.
- We do not use direct links for resources unless necessary.
- We comment where different sections are.

The recommended formatter is [Prettier](https://prettier.io/).

## Protocol Premises

Here are the reasons why we have the conventions we have.

- Indent: 4 spaces is typically equal to 1 tab, which is what Mesure73L prefers.
- Spaces around list items and operators: `[1, 2, 3]` and `x += 1` looks better than `[1,2,3]` and `x+=1`.
- No obfuscation: We want all code to be usable and editable by all users, not just one specific person.
- Read without pausing: Sometimes, people need to read the code quickly to find a specific spot in the code.
- No direct links: If someone is developing on a branch and starts a server, it will be easier to edit without just guessing.
- Comment sections: Same as read without pausing

## Recommended Resources

Here are some useful resources:

- [Visual Studio Code](https://visualstudio.microsoft.com/downloads/)
- [GitHub Desktop](https://desktop.github.com/)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode), with the following config:

```json
{
    "editor.formatOnPaste": true,
    "editor.linkedEditing": true,
    "prettier.arrowParens": "avoid",
    "prettier.bracketSpacing": false,
    "prettier.bracketSameLine": true,
    "prettier.printWidth": 100,
    "prettier.tabWidth": 4,
    "prettier.trailingComma": "none",
    "prettier.quoteProps": "consistent",
    "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

- [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)
- [GitHub Pull Requests & Issues](https://marketplace.visualstudio.com/items?itemName=GitHub.vscode-pull-request-github)
- [LiveShare](https://marketplace.visualstudio.com/items?itemName=MS-vsliveshare.vsliveshare) if working with other people often
- [markdownlint](https://marketplace.visualstudio.com/items?itemName=DavidAnson.vscode-markdownlint) if working with Markdown often

## Addition Attributions

All code on this repository is under the same license, unless specifically specified. Your license will be transferred to the repository owner and changed to [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.en). By contributing to this repository, you agree to give the license to the repository owner.

However, you will be credited where applicable, and where it will work well, for your contributions.

Exceptions may be given in specific circumstances.
