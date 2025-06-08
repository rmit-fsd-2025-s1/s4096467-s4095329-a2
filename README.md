# TeachTeam Management Application
A tutor management system called TeachTeam, aiming to streamline the process of hiring tutors by simplifying the process of finding and managing tutor to lecturer interactions.
## Planning
[Figma Wireframes (Temporary)](https://www.figma.com/design/XPXeYudCec4MmbAdDjrj9N/Full-Stack-Assignment-1?node-id=7-85&t=HvJha1oHxO9Ko48L-1)
## Sample Users
| Username | Password |
| --- | --- |
| **Candidates** |
| test1@gmail.com | Password1 |
| test2@gmail.com | Password1 |
| test3@gmail.com | Password1 |
| **Lecturers** |
| connor@gmail.com | P@ssword1 |
| will@gmail.com | P@ssword2 |
| **Administrators** |
| admin | admin |

## Software Dependencies and Versions
- node.js v22.xx.x
- npm 10.x.x
## External Components
- [chakra-ui](https://www.npmjs.com/package/@chakra-ui/react)
## Startup Guide
- Download the dependencies listed above
   - node.js
   - npm
- Download the main repo (Release coming later)
- **If you have not ran the program before**
   - Open Terminal / Command line
   - Navigate to s4096467-s4095329-a2-main/teach-team-app (The folder with /src and /public in it)
   - Run npm install
   - You should see this if it succeeds
  <br>![added 396 packages, and audited 397 packages in 36s. 132 packages are now looking for funding, run 'npm fund' for details. Found 0 vulnerabilities](https://github.com/user-attachments/assets/a2e0256a-fb0c-47a4-a2c2-2fdefcdde3d5)
- **Repeat this step for teach-team-backend and teach-team-admin**
- Within the teach-team-backend folder, type `nodemon`
   - If the port is occupied, type `npx kill-port 3001`
- Then retry the `nodemon` command
- You should see this if it succeeds
<br>![image](https://github.com/user-attachments/assets/3deb410e-e3ea-4ef8-a777-857b861ad34e)

- For the teach-team-app/admin type `npm run dev` to run as the ports do not matter for these pages
- Attempt to access the url they have given you (http://localhost:xxxx)
- If it succeeded, you will see the web page and this in your console
![Just check the web page if it has loaded, if not it will not finish loading and there likely will be errors](https://github.com/user-attachments/assets/92ae2078-4917-451f-93c8-3b49dd78a101)

## Group Members
- Will Lor (s4095329)
- Connor Orders (s4096467)
