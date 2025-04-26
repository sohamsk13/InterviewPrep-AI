import Agent from '@/components/Agent';
import React from 'react';
import { getCurrentUser } from '@/lib/actions/auth.action';

const Page = async () => {
  const user = await getCurrentUser(); // Ensure this is resolved before rendering

  return (
    <>
      <h3>Interview Generation</h3>

      {/* Only render the Agent component if user data is available */}
      {user ? (
        <Agent userName={user.name} userId={user.id} type="generate" />
      ) : (
        <p>User not found. Please log in.</p>
      )}
    </>
  );
};

export default Page;
