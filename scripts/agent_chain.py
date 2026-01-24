from crewai import Agent, Task, Crew, Process

# Agents (tailored to your repo)
idea_polisher = Agent(
    role='Idea Polisher',
    goal='Refine ideas for GameForge Mobile',
    backstory='Uses templates and Genie AI from the repo.'
)

repo_reviewer = Agent(
    role='Repo Reviewer',
    goal='Find game creator repos',
    backstory='Focuses on React Native/Expo tools.'
)

game_builder = Agent(
    role='Game Builder',
    goal='Generate TS code using repo engines',
    backstory='Builds components for src/screens/.'
)

game_tester = Agent(
    role='Game Tester',
    goal='Test for mobile bugs',
    backstory='Simulates with Pygame/Expo mocks.'
)

# Chain Tasks
def run_chain(user_idea):
    task1 = Task(description=f'Polish this idea for GameForge: {user_idea}', agent=idea_polisher)
    task2 = Task(description='Review repos for tools to enhance the polished idea', agent=repo_reviewer)
    task3 = Task(description='Build TS/JS code snippet based on polish and repos', agent=game_builder)
    task4 = Task(description='Test the built code for issues', agent=game_tester)

    crew = Crew(agents=[idea_polisher, repo_reviewer, game_builder, game_tester], tasks=[task1, task2, task3, task4], process=Process.sequential)
    result = crew.kickoff()
    print(result)  # Or write to file in prototypes/

if __name__ == '__main__':
    user_idea = input("Enter your game idea: ")  # e.g., "Match Dubai landmarks puzzle"
    run_chain(user_idea)
