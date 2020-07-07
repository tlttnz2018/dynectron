import React from 'react';

import Select from '@material-ui/core/Select';
import { connect } from 'react-redux';
import { selectProfile as selectProfileAction } from '../reducers/profile';

function Profiles({
  className,
  profiles,
  profileName,
  selectProfile,
}: {
  className?: string;
  profileName?: string;
  profiles: string[];
  selectProfile: (profile: string) => void;
}) {
  return (
    <Select
      name="profile"
      id="Profiles"
      native
      value={profileName || ''}
      onChange={(event) => {
        selectProfile(event.target.value as string);
      }}
      className={className}
    >
      <option value="" disabled selected>
        Profile...
      </option>
      <option value="environment">environment</option>
      {profiles &&
        profiles.map((profile) => {
          return (
            <option key={profile} value={profile}>
              {profile}
            </option>
          );
        })}
    </Select>
  );
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const mapStateToProps = (state) => ({
  profiles: state.app.profiles,
  profileName: state.profile.profileName,
});

const mapDispatchToProps = {
  selectProfile: selectProfileAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(Profiles);
