import { ICONS, Icon, List, Tooltip } from "@canonical/react-components";
import React, { HTMLProps } from "react";
import type { ReactNode } from "react";
import { UserSubscription } from "advantage/api/types";
import {
  EntitlementsStore,
  filterAndFormatEntitlements,
} from "advantage/react/utils/filterAndFormatEntitlements";
import {
  isBlenderSubscription,
  isFreeSubscription,
} from "advantage/react/utils";

type Props = {
  subscription: UserSubscription;
  setHasUnsavedChanges: React.Dispatch<React.SetStateAction<boolean>>;
} & HTMLProps<HTMLDivElement>;

type ListItem = {
  icon?: string;
  label: ReactNode;
};

export const generateList = (title: React.ReactNode, items: ListItem[]) => (
  <>
    <h5 className="u-no-padding--top p-subscriptions__details-small-title">
      {title}
    </h5>
    <List
      items={items.map(({ label, icon }) => ({
        className: "u-no-padding--bottom",
        content: (
          <>
            {icon ? (
              <>
                <Icon name={icon} />
                &emsp;
              </>
            ) : null}
            {label}
          </>
        ),
      }))}
    />
  </>
);

const getSupportLevel = (subscription: UserSubscription) => {
  const features: EntitlementsStore = filterAndFormatEntitlements(
    subscription.entitlements
  );
  if (features.byLabel["24/5 Support"]) {
    return "24/5 Weekday Support";
  }
  if (features.byLabel["24/7 Support"]) {
    return "24/7 Support";
  }
  return "None";
};
const DetailsTabs = ({ subscription, ...wrapperProps }: Props) => {
  const isBlender = isBlenderSubscription(subscription);
  const isFree = isFreeSubscription(subscription);
  const supportLevel = getSupportLevel(subscription);

  const UADocs = () => {
    return (
      <>
        <h5 className="u-no-padding--top p-subscriptions__details-small-title">
          Services and Documentation
        </h5>
        <table>
          {isFree ? null : (
            <>
              <thead>
                <tr>
                  <th colSpan={2}>SUPPORT</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Knowledge Base</td>
                  <td>
                    <a href="https://portal.support.canonical.com/?_ga=2.3371065.849364026.1691488233-1001052631.1648559628">
                      Online library of articles and tutorials
                    </a>
                  </td>
                </tr>
                {supportLevel == "None" ? null : (
                  <tr>
                    <td>{supportLevel}</td>
                    <td>
                      <a href="https://portal.support.canonical.com/staff/s/contactsupport">
                        Phone and ticket support
                      </a>
                    </td>
                  </tr>
                )}
                <tr>
                  <td>Ubuntu Assurance Program</td>
                  <td>
                    <a href="https://ubuntu.com/legal/ubuntu-pro-assurance">
                      Protecting your business from IP infringement
                    </a>
                  </td>
                </tr>
              </tbody>
            </>
          )}
          <thead>
            <tr>
              <th colSpan={2}>Security and Compliance</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>ESM</td>
              <td>
                <a href="https://ubuntu.com/pro/tutorial">
                  Set up access to security updates with ESM
                </a>
              </td>
            </tr>
            <tr>
              <td>
                <Tooltip message="Please read the documentation and only enable this feature if you specifically request this certification.">
                  <Icon name={ICONS.information} />
                </Tooltip>{" "}
                USG
              </td>
              <td>
                <a href="/security/certifications/docs/usg">
                  Automated hardening profiles for CIS and DISA STIG
                </a>
              </td>
            </tr>
            <tr>
              <td>
                <Tooltip message="Please read the documentation. Enabling FIPS on a machine will disable Livepatch and FIPS-update.">
                  <Icon name={ICONS.information} />
                </Tooltip>{" "}
                FIPS
              </td>
              <td>
                <a href="https://ubuntu.com/security/certifications/docs/fips">
                  NIST-certified FIPS 140 cryptographic modules for Ubuntu
                </a>
              </td>
            </tr>
            <tr>
              <td>Livepatch</td>
              <td>
                <a href="https://ubuntu.com/security/livepatch/docs">
                  Livepatch on-prem and Livepatch client
                </a>
              </td>
            </tr>
            <tr>
              <td>Landscape</td>
              <td>
                <a href="https://ubuntu.com/tutorials/enable-esm-configurations-at-scale-with-ua-client-and-landscape#2-prerequisites">
                  How to use Landscape to manage Ubuntu Systems
                </a>
              </td>
            </tr>
            <tr>
              <td>
                <Tooltip message="Only available for Ubuntu 22.04 LTS">
                  <Icon name={ICONS.information} />
                </Tooltip>{" "}
                Real-time kernel
              </td>
              <td>
                <a href="https://ubuntu.com/blog/real-time-ubuntu-is-now-generally-available">
                  Prioritise high-priority processes with deterministic response
                  times.
                </a>
              </td>
            </tr>
            <tr>
              <td>Active directory</td>
              <td>
                <a href="https://github.com/ubuntu/adsys">
                  Advanced GPO support, privilege management and script
                  execution
                </a>
              </td>
            </tr>
            <tr>
              <td>Common Criteria</td>
              <td>
                <a href="https://ubuntu.com/security/certifications/docs/16-18/cc">
                  Common Criteria EAL 2 packages for 16.04 & 18.04
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </>
    );
  };

  const blenderDocs = (
    <>
      <h5 className="u-no-padding--top p-subscriptions__details-small-title">
        Documentation & tutorials
      </h5>
      <a data-test="doc-link" href="https://blender.stackexchange.com/">
        Blender StackExchange
      </a>
    </>
  );

  return <div {...wrapperProps}>{isBlender ? blenderDocs : UADocs()}</div>;
};

export default DetailsTabs;
