async function runTest() {
  const base = 'http://localhost:3000';

  console.log('1. Registering John Doe...');
  const regRes = await fetch(`${base}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: 'password123',
      targetRole: 'Frontend Developer',
    }),
  });
  const regData = await regRes.json();
  console.log('Registration status:', regData.success ? 'SUCCESS' : regData.error);
  const token = regData.token;

  console.log('\n2. Running Onboarding for John Doe...');
  const onbRes = await fetch(`${base}/api/onboarding`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: 'John Doe',
      targetRole: 'Frontend Developer',
      skillLevel: 'Beginner',
      dailyGoalTarget: 3,
      reminderTime: '20:00',
    }),
  });
  const onbData = await onbRes.json();
  console.log('Onboarding status:', onbData.success ? 'SUCCESS' : onbData.error);

  console.log('\n3. Checking 2 roadmap topics (fe-1-1 and fe-1-2)...');
  await fetch(`${base}/api/progress/toggle`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      topicId: 'fe-1-1',
      sectionId: 'fe-sec-1',
      role: 'Frontend Developer',
    }),
  });

  const prog2Res = await fetch(`${base}/api/progress/toggle`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      topicId: 'fe-1-2',
      sectionId: 'fe-sec-1',
      role: 'Frontend Developer',
    }),
  });
  const prog2Data = await prog2Res.json();
  console.log(`Topics completed: ${prog2Data.completedTopicsCount} | Readiness Score: ${prog2Data.readinessScore}%`);

  console.log('\n4. Logging out & logging back into johndoe@gmail.com...');
  const loginRes = await fetch(`${base}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'johndoe@gmail.com',
      password: 'password123',
    }),
  });
  const loginData = await loginRes.json();
  console.log('Login status:', loginData.success ? `SUCCESS (Welcome ${loginData.user.name})` : loginData.error);
  const reloadedToken = loginData.token;

  console.log('\n5. Fetching saved progress for logged in John Doe...');
  const progressRes = await fetch(`${base}/api/progress?role=Frontend%20Developer`, {
    headers: {
      Authorization: `Bearer ${reloadedToken}`,
    },
  });
  const savedData = await progressRes.json();
  console.log(`Total saved completed topics in database: ${savedData.completedCount}`);
  savedData.progress.forEach((p) => {
    console.log(`  ✓ Topic ID: ${p.topicId} | Completed: ${p.completed}`);
  });

  if (savedData.completedCount === 2) {
    console.log('\n🎉 ALL CHECKS PASSED: State memory persistence is 100% working!');
  } else {
    console.error('\n❌ Persistence check failed.');
  }
}

runTest().catch((e) => console.error(e));
