import React from 'react';
import { Form, Input, DatePicker, Select, Button } from 'antd';
import { LinkOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import dayjs, { Dayjs } from 'dayjs';
import type { Application } from '../types/application';

const { TextArea } = Input;
const { Option } = Select;

/** Props for the application form */
interface ApplicationFormProps {
  /** Initial values to populate the form (for edit) */
  initialValues?: Partial<Application>;
  /** Called when the form is submitted with normalized values */
  onSubmit: (
    values: Omit<Application, 'id' | 'createdAt' | 'updatedAt'>
  ) => Promise<void>;
  /** Called when the user cancels out of the form */
  onCancel: () => void;
  /** Whether the primary submit button shows a loading spinner */
  loading?: boolean;
}

/** Static options for the status dropdown */
const STATUS_OPTIONS = [
  'saved',
  'applied',
  'phone_screen',
  'interview',
  'assessment',
  'final_round',
  'offer',
  'negotiating',
  'accepted',
  'rejected',
  'declined',
] as const;

/** Static options for the job type dropdown */
const JOB_TYPE_OPTIONS = [
  'full_time',
  'part_time',
  'contract',
  'internship',
  'remote',
  'hybrid',
  'onsite',
] as const;

/** Static options for the source dropdown */
const SOURCE_OPTIONS = [
  'LinkedIn',
  'Indeed',
  'Company Website',
  'Referral',
  'Job Fair',
  'Other',
] as const;

/**
 * Form component to create or update a job application.
 */
const ApplicationForm: React.FC<ApplicationFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  /**
   * Handle form submission:
   * - Ensure jobUrl starts with http(s)://
   * - Format the dateApplied field to YYYY-MM-DD
   * - Pass cleaned payload back to parent
   */
  const handleFinish = (values: any) => {
    let url = values.jobUrl?.trim() ?? '';
    if (url && !/^https?:\/\//i.test(url)) {
      url = `https://${url}`;
    }

    const payload: Omit<Application, 'id' | 'createdAt' | 'updatedAt'> = {
      ...values,
      dateApplied: (values.dateApplied as Dayjs).format('YYYY-MM-DD'),
      jobUrl: url || undefined,
    };

    onSubmit(payload);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      className="application-form"
      initialValues={{
        ...initialValues,
        dateApplied: initialValues?.dateApplied
          ? dayjs(initialValues.dateApplied)
          : dayjs(),
      }}
      onFinish={handleFinish}
    >
      {/* Company & Position fields */}
      <div className="form-grid">
        <Form.Item
          name="company"
          label={t('applications.company')}
          rules={[{ required: true, message: t('applications.companyRequired') }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="position"
          label={t('applications.position')}
          rules={[{ required: true, message: t('applications.positionRequired') }]}
        >
          <Input />
        </Form.Item>
      </div>

      {/* Location & Date Applied fields */}
      <div className="form-grid">
        <Form.Item name="location" label={t('applications.location')}>
          <Input />
        </Form.Item>
        <Form.Item
          name="dateApplied"
          label={t('applications.dateApplied')}
          rules={[{ required: true, message: t('applications.dateRequired') }]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
      </div>

      {/* Job Type & Status fields */}
      <div className="form-grid">
        <Form.Item
          name="jobType"
          label={t('applications.jobType')}
          rules={[{ required: true, message: t('applications.jobTypeRequired') }]}
        >
          <Select>
            {JOB_TYPE_OPTIONS.map((type) => (
              <Option key={type} value={type}>
                {t(`jobType.${type}`)}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="status"
          label={t('applications.status')}
          rules={[{ required: true, message: t('applications.statusRequired') }]}
        >
          <Select>
            {STATUS_OPTIONS.map((status) => (
              <Option key={status} value={status}>
                {t(`status.${status}`)}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </div>

      {/* Source & Job URL fields */}
      <div className="form-grid">
        <Form.Item name="source" label={t('applications.source')}>
          <Select>
            {SOURCE_OPTIONS.map((src) => (
              <Option key={src} value={src}>
                {src.startsWith('applications.')
                  ? t(src)
                  : src}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="jobUrl" label={t('applications.jobUrl')}>
          <Input
            prefix={<LinkOutlined />}
            placeholder="https://example.com/job"
          />
        </Form.Item>
      </div>

      {/* Notes field */}
      <Form.Item name="notes" label={t('applications.notes')}>
        <TextArea rows={4} />
      </Form.Item>

      {/* Form actions */}
      <Form.Item>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <Button onClick={onCancel}>{t('common.cancel')}</Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            {initialValues?.id ? t('common.update') : t('common.save')}
          </Button>
        </div>
      </Form.Item>
    </Form>
  );
};

export default ApplicationForm;
