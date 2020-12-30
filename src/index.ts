import {convertFromVersionSlug, downloadPackerCLI} from './main'
import * as core from '@actions/core'

async function run(): Promise<void> {
  try {
    const target_version = await convertFromVersionSlug(
      core.getInput('packer_version')
    )
    const exec_dir_path = await downloadPackerCLI(target_version)

    // not planning to implement wrapper function ;P
    // await renamePackerCLI(exec_dir_path)

    core.addPath(exec_dir_path)
  } catch (e) {
    core.setFailed(e)
  }
}

run()
