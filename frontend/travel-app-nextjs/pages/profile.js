import React from 'react';
import FollowButton from '../components/FollowButton';

const Profile = ({ user }) => {
  return (
    <div>
      <h1>{user.name}'s Profile</h1>
      <FollowButton followingId={user.id} />
    </div>
  );
};

export async function getServerSideProps(context) {
  const userId = context.params.id;

  // Pretpostavljamo da imate API endpoint za dobijanje korisničkih podataka
  const res = await fetch(`http://localhost:8000/api/users/${userId}`);
  const user = await res.json();

  return {
    props: {
      user,
    },
  };
}

export default Profile;
