import subprocess

for command in ['git add *', f'git commit -m {"Commit message: "}', 'git push']:
    subprocess.run(command, shell=True)