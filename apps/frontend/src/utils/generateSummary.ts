export function generateTheSummary() {
  const summaries = [
    `Our platform offers seamless integration  
with modern tools and workflows.  
Built for developers, loved by teams.  
Achieve more with fewer manual steps.  
Experience speed, reliability, and support.`,

    `From concept to deployment,  
we simplify every stage of development.  
Flexible architecture for any project size.  
Stay ahead with continuous updates.  
Empower your team with smarter tools.`,

    `Crafted for performance and ease-of-use,  
our solution adapts to your needs.  
Scale confidently without complexity.  
Enjoy intuitive dashboards and controls.  
Focus more on strategy, less on setup.`,

    `Revolutionize your operations  
with intelligent automation and insights.  
Manage tasks, teams, and timelines effortlessly.  
Real-time monitoring keeps you informed.  
Say goodbye to cluttered workflows.`,

    `Launch faster with pre-built modules  
and drag-and-drop simplicity.  
Whether you're a startup or enterprise,  
we deliver reliability you can trust.  
Innovate without technical roadblocks.`,

    `Your ideas deserve the best tools.  
Collaborate, build, and ship with ease.  
Security and performance baked in.  
Analytics and reports made effortless.  
Welcome to the future of development.`,
  ];

  const randomIndex = Math.floor(Math.random() * summaries.length);
  return summaries[randomIndex];
}
