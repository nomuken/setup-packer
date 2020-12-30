# setup-packer
The `nomuken/setup-packer` action is a Javascript action that set up Packer CLI in your GitHub Actions.

- Not using docker container
- Download Packer CLI and adding it to the `PATH`

## Usage
This action can be running on below.
- Ubuntu (`ubuntu-20.04`)
- macOS (Not tested)
- Windows (Not tested)

Simple usage (install latest version of Packer CLI)
```yaml
steps:
- uses: nomuken/setup-packer@v1
```

A specific version of Packer CLI.
```yaml
steps:
- uses: nomuken/setup-packer@v1
  with:
    packer_version: 'v1.6.6'
```

## Inputs
- `packer_version` - (Optional) The version of Packer CLI to install. It can set "latest" or release tag_name.
- `github_token` - (Optional) GitHub Token for searching recent packer release.

## License
MIT
