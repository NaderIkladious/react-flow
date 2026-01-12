# Contributing

Thanks for your interest in improving react-flow.

## Commit Messages (Changelog Friendly)
We use Conventional Commits so changelogs can be generated automatically.

Format:
```
<type>(optional-scope): <short summary>
```

Types:
- `feat`: new feature
- `fix`: bug fix
- `docs`: documentation changes
- `chore`: tooling/maintenance
- `refactor`: code change that neither fixes a bug nor adds a feature
- `test`: tests only

Examples:
```
feat(core): add Switch/Case/Default
fix(example): update ReactFlow imports
docs: add usage notes for Switch
chore: update build config
```

Guidelines:
- Use present tense, imperative mood.
- Keep summaries under 72 characters.
- Reference issues if applicable, e.g. `fix: handle undefined (#12)`.

## Changelog
Generate/update the changelog from the root:
```
npm run changelog
```

First-time generation:
```
npm run changelog:first
```

## Versioning & Tags
We follow SemVer and tag releases after updating `package.json`:

- **patch**: fixes, small improvements, internal refactors
- **minor**: new backwards-compatible features
- **major**: breaking changes or API removals

Suggested flow:
```
npm version patch   # or minor / major
git push --follow-tags
```
