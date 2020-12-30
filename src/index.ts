import { convertFromVersionSlug, downloadPackerCLI, renamePackerCLI } from './main'
import * as core from '@actions/core'

async function runner(): Promise<void> {
  const target_version = await convertFromVersionSlug(core.getInput("packer_version"))
  const exec_dir_path = await downloadPackerCLI(target_version)
  await renamePackerCLI(exec_dir_path)
}

runner().catch(core.setFailed)
