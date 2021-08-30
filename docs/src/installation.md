---
title: Installation
---

`on-circle` is meant to be saved as part of your `devDependencies`.

```bash
yarn add --dev on-circle
```

## Local commands

All the `on-circle` local commands work by contacting the CircleCI API, and thus
requires a valid `CIRCLECI_TOKEN`. You can create one on your [CircleCI
dashboard][1].

## Remote execution

The `.run()` method is meant to be executed on CircleCI machines, and integrates
smoothly with git so it can push back to the repository and file issues in case
of an error.

To do that, a bit more configuration is required. Specifically, we will need to
configure CircleCI so it can talk with the GitHub API, as well as give it
writing rights to the repository.

Fortunately, `on-circle` can do all this configuration automatically, provided
you have all the right credentials available.

The way it works is by storing a `GITHUB_TOKEN` as an environment variable on
your CircleCI project, so CircleCI can create issues through the GitHub API. We
will also store a custom private ssh key on CircleCI, and configure GitHub to
accept it.

### 1. Getting a GitHub token

Start by creating a new GitHub token from your [GitHub dashboard][2], and give
it the `repo` rights.

Be careful, those tokens can do everything the user that created them can do and
there is no way to scope them to a specific repository (as far as I know; if you
know better, let me know!).

### 2. Checking that you have `ssh-keygen`

`on-circle` will generate a new pair of ssh keys so CircleCI can push back to
GitHub. It will use the `ssh-keygen` command internally, but will fail if you
don't have it available.

### 3. Running the command

Once you have your token, you can run the following command to configure your
CircleCI project:

```bash
GITHUB_TOKEN=xxYOUR_GITHUB_TOKENxx yarn run oncircle git
```

### 4. Updating your `.circleci/config.yml` file

By default, CircleCI does not load your ssh keys in every job. You need to
explicitly ask for it. It usually requires you adding the `add_ssh_keys` step to
your job configuration.

```yaml
version: 2
jobs:
  my-custom-job:
    steps:
      - checkout
      - add_ssh_keys # This is the line to add
      # […]
```

Now, everything is correctly configured, and you can use the [run][3]
command as expected.

[1]: https://app.circleci.com/settings/user/tokens
[2]: https://github.com/settings/tokens
[3]: /run/
