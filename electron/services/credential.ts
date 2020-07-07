import AWS, { Credentials } from 'aws-sdk';

export default function credential({
  profile,
}: {
  profile: string;
}): Credentials {
  if (profile === 'environment') {
    return new AWS.EnvironmentCredentials('AWS');
  }

  return new AWS.SharedIniFileCredentials({ profile });
}
