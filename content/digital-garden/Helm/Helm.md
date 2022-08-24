
Source: [A Beginner's Guide to Helm](https://www.youtube.com/watch?v=5_J7RWLLVeQ)

- Helm is a package manager for Kubernetes.
- Why is it useful? 
	- Kubernetes is declarative. We tell it what we want, and Kubernetes makes it happen. 
	- Checks that the desired state (defined by many `YAML` files) matches the current state.
	- We often have many files like `deployment.yaml` , `configmaps.yaml`,`persistmentVolume.yaml`, `secrets.yaml` for a single application). 
	- These files are not dependent, hard to maintain, and cannot easily be reproduced. 
- Helm groups the YAML files needed to deploy an app:
	- Turn them into templates `templates` directory.
	-  akes injecting values into these templates easier.
- It brings all of these yaml files