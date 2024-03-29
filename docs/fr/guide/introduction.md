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
    title: 'Original author',
    links: [
      { icon: 'github', link: 'https://github.com/bpatzak' },
      { icon: { svg: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="style=stroke" clip-path="url(#clip0_1_1828)"> <g id="web"> <path id="vector (Stroke)" fill-rule="evenodd" clip-rule="evenodd" d="M10.4425 2.44429C10.0752 3.64002 9.32073 6.25569 8.89915 8.83258C9.99331 9.00921 11.0621 9.12209 12 9.12209C12.9379 9.12209 14.0067 9.00921 15.1009 8.83258C14.6793 6.25569 13.9248 3.64002 13.5575 2.44429C13.0509 2.3624 12.5307 2.31977 12 2.31977C11.4693 2.31977 10.9491 2.3624 10.4425 2.44429ZM15.3337 2.90893C15.737 4.305 16.2958 6.42828 16.6448 8.54737C18.1513 8.23703 19.5727 7.85824 20.605 7.56109C19.4986 5.42102 17.6172 3.74662 15.3337 2.90893ZM21.2129 9.01933C20.1222 9.33683 18.5423 9.76328 16.8594 10.1057C16.9295 10.7564 16.9709 11.3958 16.9709 12C16.9709 12.8816 16.8827 13.8411 16.7445 14.8058C18.759 14.3858 20.6068 13.849 21.5557 13.5575C21.6376 13.0509 21.6802 12.5307 21.6802 12C21.6802 10.959 21.5162 9.95751 21.2129 9.01933ZM21.0911 15.3337C19.9166 15.6729 18.229 16.1219 16.4634 16.4634C16.1219 18.229 15.6729 19.9166 15.3337 21.0911C17.9978 20.1138 20.1138 17.9978 21.0911 15.3337ZM13.5576 21.5557C13.849 20.6068 14.3858 18.759 14.8058 16.7445C13.8411 16.8827 12.8816 16.9709 12 16.9709C11.1184 16.9709 10.1589 16.8827 9.19423 16.7445C9.61421 18.759 10.151 20.6068 10.4425 21.5557C10.9491 21.6376 11.4693 21.6802 12 21.6802C12.5307 21.6802 13.0509 21.6376 13.5576 21.5557ZM8.66629 21.0911C8.32707 19.9166 7.8781 18.229 7.53658 16.4634C5.77099 16.1219 4.08335 15.6729 2.90891 15.3337C3.88622 17.9978 6.00216 20.1138 8.66629 21.0911ZM2.44429 13.5575C3.39316 13.849 5.24101 14.3858 7.25548 14.8058C7.1173 13.8411 7.02907 12.8816 7.02907 12C7.02907 11.3958 7.07048 10.7564 7.14056 10.1057C5.45769 9.76328 3.87779 9.33683 2.78712 9.01933C2.48383 9.95751 2.31977 10.959 2.31977 12C2.31977 12.5307 2.3624 13.0509 2.44429 13.5575ZM3.39504 7.56109C4.42731 7.85824 5.84865 8.23703 7.35522 8.54737C7.70416 6.42827 8.26303 4.305 8.66626 2.90893C6.38282 3.74662 4.50139 5.42102 3.39504 7.56109ZM8.68924 10.3888C8.63137 10.9544 8.59884 11.4968 8.59884 12C8.59884 12.9399 8.71224 14.012 8.88985 15.1102C9.98798 15.2878 11.0601 15.4012 12 15.4012C12.9399 15.4012 14.012 15.2878 15.1102 15.1102C15.2878 14.012 15.4012 12.9399 15.4012 12C15.4012 11.4968 15.3686 10.9544 15.3108 10.3888C14.1776 10.5703 13.0348 10.6919 12 10.6919C10.9652 10.6919 9.82236 10.5703 8.68924 10.3888ZM9.67273 0.991173C10.4243 0.833026 11.2029 0.75 12 0.75C12.7971 0.75 13.5757 0.833026 14.3273 0.991174C18.0108 1.76627 21.0281 4.34097 22.42 7.75174C22.9554 9.06356 23.25 10.4983 23.25 12C23.25 12.7971 23.167 13.5757 23.0088 14.3273C22.0943 18.6736 18.6736 22.0943 14.3273 23.0088C13.5757 23.167 12.7971 23.25 12 23.25C11.2029 23.25 10.4243 23.167 9.67273 23.0088C5.32644 22.0943 1.90572 18.6736 0.991173 14.3273C0.833026 13.5757 0.75 12.7971 0.75 12C0.75 10.4972 1.04509 9.06132 1.58123 7.74866C2.97369 4.33943 5.99026 1.76604 9.67273 0.991173Z" fill="currentColor"></path> </g> </g> <defs> <clipPath id="clip0_1_1828"> <rect width="24" height="24" fill="white"></rect> </clipPath> </defs> </g></svg>'}, link: 'http://ksm.fsv.cvut.cz/~bp/'}
    ]
  }
]
</script>

# Introduction

Bienvenue dans <Edubeam />, votre application web en ligne pour l'analyse structurelle. L'analyse structurelle devient accessible sans nécessiter d'installation ou de configuration complexe.

<hr>

Cliquez [ici](https://run.edubeam.app/?lang=fr) pour accéder à <Edubeam /> et commencer votre voyage d'analyse structurelle.

<figure>
  <a href="https://run.edubeam.app/?lang=fr" target="_blank">
    <WelcomeStructure />
    </a>
  <figcaption>edubeam en action</figcaption>
</figure>

## Caractéristiques

- **Solveur de poutre et de treillis 2D**: Analyse et résolution de structures 2D en toute transparence.

- **Interface conviviale**: Conception intuitive pour une navigation sans effort.

- **Gratuit et en ligne**: Accès à tout moment et en tout lieu pour une commodité maximale.

- **Focus sur l'étudiant et l'enseignant**: Des fonctionnalités sur mesure pour une expérience d'apprentissage optimale.

- **Innovation Open-Source**: Collaborez et contribuez à l'évolution de <Edubeam />.

- **Partage facile des projets**: Partagez vos projets sans effort grâce à une fonction URL.

## Localisation

EduBeam est disponible en plusieurs langues afin d'améliorer votre expérience utilisateur.

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

## Les auteurs

<Edubeam /> est un projet collaboratif alimenté par une communauté de contributeurs dévoués qui sont passionnés par l'avancement de l'enseignement de l'analyse structurelle. Il est développé et maintenu par une petite équipe du département de mécanique de [CTU Prague - Faculté de génie civil](https://www.fsv.cvut.cz/en).

<VPTeamMembers size="small" :members="members" />

[L'application](https://www.oofem.org/wiki/doku.php?id=edubeam:edubeam_en) de bureau originale a été développée par [Bořek Patzák](http://ksm.fsv.cvut.cz/~bp/), [Jan Stránský](https://mech.fsv.cvut.cz/~stransky/en/) et [Vít Šmilauer](https://mech.fsv.cvut.cz/~smilauer/).

## S'impliquer

N'hésitez pas à rejoindre notre communauté et à contribuer à la croissance de <Edubeam />. Votre implication peut aller du test et du signalement de problèmes à la participation active au processus de développement.

Voici quelques façons de vous impliquer et de contribuer à <Edubeam /> :

1. **Contribuer au code:**

   - Explorez notre [dépôt GitHub] (https://github.com/janvorisek/edubeam) et contribuez au développement du code.
   - Choisissez parmi une variété de tâches, de l'analyse structurelle de base à l'implémentation de fonctionnalités avancées.

2. **Tests et rapports de bogues:**

   - Testez <Edubeam /> et signalez tout bogue ou problème sur notre [issue tracker](https://github.com/janvorisek/edubeam/issues).
   - Vos commentaires sont essentiels pour améliorer la fiabilité et la fonctionnalité de <Edubeam />.

3. **Documentation:**

   - Aidez-nous à améliorer notre documentation pour rendre <Edubeam /> plus convivial.
   - Contribuez à l'élaboration de tutoriels, de guides ou de FAQ afin d'améliorer l'expérience d'apprentissage des utilisateurs.

4. **Faites passer le message:**
   - Partagez <Edubeam /> avec vos pairs et sur les médias sociaux.
   - Votre soutien contribue à la croissance de notre communauté et permet à un plus grand nombre d'étudiants de bénéficier de <Edubeam />.

Prêt à commencer ? Choisissez un mode de contribution qui correspond à vos compétences et à vos intérêts, et devenez un élément précieux de la communauté <Edubeam /> !
