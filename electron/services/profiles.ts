import AWS from 'aws-sdk';

export default async function profiles() {
  // FIXME: Do I need to getCredentials first to make sure profiles is loaded?
  // eslint-disable-next-line compat/compat
  return new Promise((resolve, reject) => {
    AWS.config.getCredentials((err) => {
      if (err) {
        return reject(err);
      }

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const { iniLoader } = AWS.util;

      // HACK: private API of AWS to get list of profiles
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const configs = AWS.util.getProfilesFromSharedConfig(iniLoader);

      // FIXME: Don't know why Object.keys doesn't work here. Check later on
      const staticProfiles = [];
      // eslint-disable-next-line guard-for-in,no-restricted-syntax
      for (const profile in configs) {
        staticProfiles.push(profile);
      }

      return resolve(staticProfiles);
    });
  });
}
