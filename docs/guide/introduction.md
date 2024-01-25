<script setup>
import { VPTeamMembers } from 'vitepress/theme'

const members = [
  {
    avatar: 'https://www.github.com/janvorisek.png',
    name: 'Jan Voříšek',
    title: 'Maintainer, UI/UX',
    links: [
      { icon: 'github', link: 'https://github.com/janvorisek' },
      { icon: 'twitter', link: 'https://twitter.com/janvorisekdev' },
    ]
  },
  {
   avatar: 'https://www.github.com/bpatzak.png',
    name: 'Bořek Patzák',
    title: 'Original author, FEA library',
    links: [
      { icon: 'github', link: 'https://github.com/bpatzak' },
    ]
  }
]
</script>

# Introduction

Welcome to <Edubeam />, your online web app for structural analysis. The structural analysis becomes accessible without the need for installation or complex setup.

<hr>

Click [here](https://run.edubeam.app) to access <Edubeam /> and start your structural analysis journey.

[![EduBeam Live](/download.png)](https://run.edubeam.app)

## Features

- **2D Beam/Truss Solver**: Seamlessly analyze and solve 2D structures.

- **User-Friendly Interface**: Intuitive design for effortless navigation.

- **Free and Online**: Access Edubeam anytime, anywhere for ultimate convenience.

- **Student & Teacher Focus**: Tailored features for an optimal learning experience.

- **Open-Source Innovation**: Collaborate and contribute to the evolution of Edubeam.

- **Easy Project Sharing**: Share your projects effortlessly with an URL feature.

## Localization

<Edubeam /> is available in available in multiple languages to enhance your user experience.

<div>

<table>
    <tr>
        <td><img src="language-icons/icons/en.svg" style="height: 24px;" alt="English" /></td>
        <td><a href="https://run.edubeam.app/?lang=en" target="_blank">English</a></td>
    </tr>
    <tr>
        <td><img src="language-icons/icons/de.svg" style="height: 24px;" alt="Deutsch" /></td>
        <td><a href="https://run.edubeam.app/?lang=de" target="_blank">Deutsch</a></td>
    </tr>
    <tr>
        <td><img src="language-icons/icons/es.svg" style="height: 24px;" alt="Español" /></td>
        <td><a href="https://run.edubeam.app/?lang=es" target="_blank">Español</a></td>
    </tr>
    <tr>
        <td><img src="language-icons/icons/fr.svg" style="height: 24px;" alt="Français" /></td>
        <td><a href="https://run.edubeam.app/?lang=fr" target="_blank">Français</a></td>
    </tr>
    <tr>
        <td><img src="language-icons/icons/cs.svg" style="height: 24px;" alt="Čeština" /></td>
        <td><a href="https://run.edubeam.app/?lang=cs" target="_blank">Čeština</a></td>
    </tr>
    <tr>
        <td><img src="language-icons/icons/zh.svg" style="height: 24px;" alt="中文" /></td>
        <td><a href="https://run.edubeam.app/?lang=cn" target="_blank">中文</a></td>
    </tr>
</table>

</div>

## The Authors

<Edubeam /> is a collaborative effort driven by a community of contributors passionate about structural analysis education.

<VPTeamMembers size="small" :members="members" />

Feel free to join our community and contribute to the growth of <Edubeam />. Your involvement can range from testing and reporting issues to actively participating in the development process.

## Get Involved

Here are some ways you can get involved and contribute to <Edubeam />:

1. **Contribute Code:**

   - Explore our [GitHub repository](link_to_repository) and contribute to code development.
   - Choose from a variety of tasks, from basic structural analysis to advanced feature implementation.

2. **Testing and Bug Reporting:**

   - Test <Edubeam /> and report any bugs or issues on our [issue tracker](link_to_issue_tracker).
   - Your feedback is crucial for improving the reliability and functionality of <Edubeam />.

3. **Documentation:**

   - Help improve our documentation to make <Edubeam /> more user-friendly.
   - Contribute tutorials, guides, or FAQs to enhance the learning experience for users.

4. **Spread the Word:**
   - Share <Edubeam /> with your peers and on social media.
   - Your support helps grow our community and ensures more students benefit from <Edubeam />.

Ready to get started? Choose a contribution path that suits your skills and interests, and become a valuable part of the <Edubeam /> community!
