import type { Metadata } from "next";
import {
  IconActivityHeartbeat,
  IconLockCheck,
  IconShieldCheck,
} from "@tabler/icons-react";
import { BrandLogo } from "@/components/BrandLogo";
import { LoginForm } from "@/modules/auth";
import styles from "./login.module.css";

export const metadata: Metadata = {
  title: "机构登录 | Actinver",
};

export default function LoginPage() {
  return (
    <main className={styles.page}>
      <div className={styles.backgroundEntrance} aria-hidden="true">
        <div className={styles.worldMap} />
        <div className={styles.dataGrid} />
        <div className={styles.networkLayer}>
          {Array.from({ length: 14 }, (_, index) => (
            <i key={index} />
          ))}
        </div>
        <div className={styles.vignette} />
      </div>

      <header className={`${styles.titleEntrance} ${styles.systemTitle}`}>
        <span>ACTINVER</span>
        <i aria-hidden="true" />
        <strong>机构核心运营管理系统 — 执行终端</strong>
      </header>

      <section className={styles.loginStage} aria-label="机构登录">
        <div className={`${styles.logoEntrance} ${styles.logoWrap}`}>
          <BrandLogo
            variant="actinver"
            priority
            className="h-auto w-[clamp(230px,20vw,360px)]"
          />
        </div>

        <div className={`${styles.cardEntrance} ${styles.loginCard}`}>
          <div className={styles.accessRail} aria-hidden="true">
            <span>INSTITUTIONAL CORE</span>
            <i />
            <span>SECURE TERMINAL ACCESS</span>
          </div>

          <div className={styles.cardHeader}>
            <div>
              <span>SECURE ACCESS</span>
              <h1>机构登录</h1>
              <p>使用已授权账户进入执行终端</p>
            </div>
            <div className={styles.securityMark} aria-hidden="true">
              <IconShieldCheck size={24} stroke={1.45} />
            </div>
          </div>

          <LoginForm />

          <div className={styles.securityStatus}>
            <span>
              <IconLockCheck size={15} stroke={1.5} aria-hidden="true" />
              双重认证由系统自动校验
            </span>
            <strong>
              <IconActivityHeartbeat size={15} stroke={1.5} aria-hidden="true" />
              在线
            </strong>
          </div>
        </div>
      </section>

      <footer className={`${styles.statusEntrance} ${styles.systemStatus}`}>
        <span className={styles.liveDot} aria-hidden="true" />
        <strong>在线</strong>
        <i>/</i>
        <span>v1.1.0</span>
        <i>/</i>
        <span>机构生产环境</span>
      </footer>

      <div className={`${styles.statusEntrance} ${styles.connectionStatus}`}>
        <span>系统状态</span>
        <strong><i aria-hidden="true" />在线连接</strong>
      </div>
    </main>
  );
}
