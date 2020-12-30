const ARCH: {[name: string]: string} = {
  arm: 'arm',
  arm64: 'arm64',
  x32: '386',
  x64: 'amd64'
}

const PLATFORM: {[name: string]: string} = {
  sunos: 'solaris',
  win32: 'windows'
}

export {ARCH, PLATFORM}
