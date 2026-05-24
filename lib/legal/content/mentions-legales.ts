import { inline, labeledItem, listItem, paragraph, plainList, plainParagraph } from "@/lib/legal/helpers";
import type { LegalDocumentDefinition } from "@/lib/legal/types";

export const mentionsLegalesDocument: LegalDocumentDefinition = {
  id: "mentions-legales",
  title: "Mentions légales",
  pdfFilename: "mentions-legales.pdf",
  pdfDownloadLabel: "Télécharger les mentions légales",
  seoTitle: "Mentions légales",
  seoDescription:
    "Mentions légales de LT Protect Formation : protection des données personnelles (RGPD), droits des utilisateurs et informations réglementaires.",
  path: "/mentions-legales",
  heroEyebrow: "Informations légales",
  sections: [
    {
      title: "1. Protection des données personnelles (RGPD)",
      blocks: [
        plainParagraph(
          "Le site Learn To Protect Formation respecte la vie privée de ses utilisateurs et se conforme strictement aux lois en vigueur sur la protection des données personnelles, notamment au Règlement Général sur la Protection des Données (RGPD - UE 2016/679) et à la Loi Informatique et Libertés.",
        ),
      ],
      subsections: [
        {
          title: "1.1 Données collectées",
          blocks: [
            plainParagraph(
              "Dans le cadre de l'utilisation des formulaires de contact et de préinscription sur notre site, nous collectons les données suivantes :",
            ),
            {
              type: "list",
              items: [
                listItem(
                  inline("Formulaire de contact", { bold: true }),
                  inline(" : nom, prénom, adresse email, message"),
                ),
                listItem(
                  inline("Formulaire de préinscription", { bold: true }),
                  inline(
                    " : nom, prénom, date de naissance, lieu de naissance, nationalité, adresse, code postal, ville, téléphone, email, niveau de formation SSIAP souhaité, pièce d'identité (copie numérique)",
                  ),
                ),
              ],
            },
          ],
        },
        {
          title: "1.2 Finalités du traitement",
          blocks: [
            plainParagraph("Les données collectées sont utilisées aux fins suivantes :"),
            plainList([
              "Répondre à vos demandes d'information via le formulaire de contact",
              "Traiter votre demande de préinscription à une formation",
              "Vous envoyer des informations relatives à votre demande de préinscription",
              "Vous contacter dans le cadre du suivi de votre demande",
              "Établir votre dossier de formation et répondre aux obligations légales et réglementaires",
            ]),
          ],
        },
        {
          title: "1.3 Base légale du traitement",
          blocks: [
            plainParagraph(
              "Le traitement de vos données personnelles est basé sur votre consentement explicite lors de la soumission du formulaire, ainsi que sur l'exécution de mesures précontractuelles prises à votre demande (préinscription à une formation).",
            ),
          ],
        },
        {
          title: "1.4 Transmission et stockage des données",
          blocks: [
            plainParagraph(
              "Lorsque vous remplissez un formulaire sur notre site, les données sont :",
            ),
            plainList([
              "Traitées temporairement sur nos serveurs sécurisés pour l'envoi des emails de confirmation et notification",
              "Transmises via Resend (service d'envoi d'emails) qui agit en tant que sous-traitant.",
              "Stockées de manière sécurisée dans notre boîte mail professionnelle hébergée par Google Workspace (Gmail), qui respecte le RGPD et dispose des certifications de sécurité requises",
              "Dans le cas des pièces d'identité jointes au formulaire de préinscription, ces documents sont transmis uniquement par email et ne sont pas stockés sur nos serveurs",
            ]),
          ],
        },
        {
          title: "1.5 Durée de conservation",
          blocks: [
            plainParagraph(
              "Les données personnelles collectées via nos formulaires sont conservées pendant une durée de 3 ans à compter de la fin de la relation avec l'utilisateur. En ce qui concerne les pièces d'identité, elles sont conservées uniquement le temps nécessaire au traitement de votre demande de préinscription et à l'établissement de votre dossier de formation, sans excéder 1 an.",
            ),
          ],
        },
        {
          title: "1.6 Droits des utilisateurs",
          blocks: [
            plainParagraph(
              "Conformément au RGPD et à la Loi Informatique et Libertés, vous disposez des droits suivants concernant vos données personnelles :",
            ),
            plainList([
              "Droit d'accès aux données",
              "Droit de rectification des données inexactes",
              "Droit à l'effacement des données (droit à l'oubli)",
              "Droit à la limitation du traitement",
              "Droit à la portabilité des données",
              "Droit d'opposition au traitement",
              "Droit de retirer votre consentement à tout moment",
              "Droit d'introduire une réclamation auprès de la CNIL",
            ]),
            paragraph(
              inline(
                "Pour exercer ces droits, vous pouvez nous contacter par email à l'adresse : ",
              ),
              inline("ltprotect.formation@gmail.com", {
                href: "mailto:ltprotect.formation@gmail.com",
              }),
              inline(" ou par courrier à l'adresse postale mentionnée ci-dessus."),
            ),
          ],
        },
      ],
    },
    {
      title: "2. Modifications des mentions légales",
      blocks: [
        plainParagraph(
          "Learn To Protect Formation se réserve le droit de modifier à tout moment les présentes mentions légales. Les utilisateurs du site sont invités à les consulter régulièrement.",
        ),
        plainParagraph("Dernière mise à jour : 27/03/2025"),
      ],
    },
    {
      title: "3. Droit applicable et juridiction compétente",
      blocks: [
        plainParagraph(
          "Les présentes mentions légales sont régies par le droit français. En cas de litige, les tribunaux français seront seuls compétents.",
        ),
      ],
    },
  ],
};
