import * as os from 'os'
import * as core from '@actions/core'
import * as github from '@actions/github'
import * as toolcache from '@actions/tool-cache'
import * as path from 'path'
import * as io from '@actions/io'
import {ARCH, PLATFORM} from './consts'

function getArch(): string {
  return ARCH[os.arch()] || os.arch()
}

function getPlatform(): string {
  return PLATFORM[os.platform()] || os.platform()
}

function getDownloadURL(version: string): string {
  return `https://releases.hashicorp.com/packer/${version}/packer_${version}_${getPlatform()}_${getArch()}.zip`
}

async function getPackerRecentReleases(): Promise<string[]> {
  const github_token = core.getInput('github_token')
  const octkit = github.getOctokit(github_token)

  // get release name from packer repository
  // FIXME: It expect returning 100 releases. but GitHub REST API return only 17 releases (bug?)
  const packer_releases = await octkit.repos.listReleases({
    owner: 'hashicorp',
    repo: 'packer',
    per_page: 100
  })

  const releases: string[] = packer_releases.data
    .map(el => el.tag_name)
    .filter((el): el is string => el !== 'nightly' && Boolean(el))
    .map(el => {
      const m = el.match(/((\d+)\.?){3}/g)
      if (m === null) return el
      return m[0]
    })

  core.debug(`Discoverd Packer versions: [${releases}]`)

  return releases
}

async function convertFromVersionSlug(slug: string): Promise<string> {
  // only accept tag_name of Packer repository (e.g. "v1.23.4") or "latest"
  if (slug !== 'latest' && !/^v((\d+)\.)+\d$/g.test(slug)) {
    throw new Error(`Invalid version format: ${slug}`)
  }

  const recent_releases = await getPackerRecentReleases()
  const version_slug = slug === 'latest' ? recent_releases[0] : slug.substr(1)

  if (!recent_releases.includes(version_slug)) {
    core.warning(
      `Packer version "v${version_slug}" is not included a recent Packer releases.`
    )
  }

  return version_slug
}

async function downloadPackerCLI(version: string): Promise<string> {
  const url = getDownloadURL(version)
  core.debug(`Download Packer from ${url}`)
  const download_path = await toolcache.downloadTool(url)
  core.debug(`Downloaded archive path: ${download_path}`)
  const cli_path = await toolcache.extractZip(download_path)
  core.debug(`Packer CLI Path: ${cli_path}`)

  return cli_path
}

async function renamePackerCLI(
  packer_cli_directory_path: string
): Promise<void> {
  const suffix = getPlatform() === 'windows' ? '.exe' : ''
  const src = path.join(packer_cli_directory_path, `packer${suffix}`)
  const dest = path.join(packer_cli_directory_path, `packer-bin${suffix}`)

  try {
    core.debug(`Moving "${src}" to "${dest}".`)
    await io.mv(src, dest)
  } catch (e) {
    core.error(`Unable to move "${src}" to "${dest}".`)
    throw e
  }
}

export {convertFromVersionSlug, downloadPackerCLI, renamePackerCLI}
